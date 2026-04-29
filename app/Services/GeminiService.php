<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GeminiService
{
    private string $apiKey;
    private string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
        $this->apiUrl = config('services.gemini.url');
    }

    public function generateSalesPage(array $productData): array
    {
        $prompt = $this->buildPrompt($productData);
        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'maxOutputTokens' => 2048,
            ]
        ];

        $maxRetries = (int) config('services.gemini.retries', 3);
        $timeout = (int) config('services.gemini.timeout', 30);
        $attempt = 0;
        $response = null;
        $lastExceptionMessage = null;

        while ($attempt < $maxRetries) {
            try {
                $response = Http::timeout($timeout)->post("{$this->apiUrl}?key={$this->apiKey}", $payload);

                if ($response->successful()) {
                    break;
                }

                $body = $response->body();
                $apiMessage = $response->json('error.message') ?? $body;
                Log::warning('Gemini API non-success response', ['attempt' => $attempt + 1, 'status' => $response->status(), 'message' => $apiMessage]);

                // transient errors: too many requests or server errors
                if (in_array($response->status(), [429]) || ($response->status() >= 500 && $response->status() < 600) || str_contains(strtolower($apiMessage), 'high demand') || str_contains(strtolower($apiMessage), 'temporar')) {
                    $attempt++;
                    $wait = (int) pow(2, $attempt);
                    sleep($wait);
                    continue;
                }

                // non-retriable error: break and surface message
                $lastExceptionMessage = $apiMessage;
                break;
            } catch (	hrowable $e) {
                Log::warning('Gemini API request failed', ['attempt' => $attempt + 1, 'error' => $e->getMessage()]);
                $lastExceptionMessage = $e->getMessage();
                $attempt++;
                sleep((int) pow(2, $attempt));
                continue;
            }
        }

        // If we exhausted retries and still failed, try fallback URL if configured
        if ((is_null($response) || !$response->successful()) && ($fallback = config('services.gemini.fallback_url'))) {
            Log::info('Attempting fallback Gemini URL', ['fallback' => $fallback]);
            try {
                $response = Http::timeout($timeout)->post("{$fallback}?key={$this->apiKey}", $payload);
            } catch (\Throwable $e) {
                Log::error('Gemini fallback request failed', ['error' => $e->getMessage()]);
                $lastExceptionMessage = $e->getMessage();
            }
        }

        if (is_null($response) || !$response->successful()) {
            $apiMessage = $response?->json('error.message') ?? $lastExceptionMessage ?? ($response?->body() ?? 'Unknown error');
            Log::error('Gemini API error', ['status' => $response?->status(), 'body' => $response?->body(), 'message' => $apiMessage]);
            throw new Exception('AI generation failed: ' . $apiMessage);
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if (!$text) {
            throw new Exception('Empty response from AI. Please try again.');
        }

        return $this->parseJsonResponse($text);
    }

    private function buildPrompt(array $data): string
    {
        $featuresText = is_array($data['features'])
            ? implode(', ', $data['features'])
            : $data['features'];

                // use unique delimiters to help reliably extract the JSON response
                return <<<PROMPT
You are an expert marketing copywriter. Generate a complete, persuasive sales page for the following product.

IMPORTANT: Return ONLY the JSON object between the delimiters EXACTLY as shown, and nothing else.

<<<AI_JSON_START>>>
{
    "headline": "A compelling, benefit-driven headline (max 12 words)",
    "sub_headline": "Supporting headline that adds context (max 20 words)",
    "description": "2-3 paragraph product description, persuasive and clear",
    "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
    "features": [
        {"title": "Feature Name", "detail": "One sentence explanation"},
        {"title": "Feature Name", "detail": "One sentence explanation"},
        {"title": "Feature Name", "detail": "One sentence explanation"}
    ],
    "social_proof": "A realistic placeholder testimonial with name and role",
    "pricing_text": "Pricing summary text (mention the price and value)",
    "cta_text": "Call-to-action button text (max 6 words)"
}
<<<AI_JSON_END>>>

Product name: {$data['product_name']}
Description: {$data['description']}
Key features: {$featuresText}
Target audience: {$data['target_audience']}
Price: {$data['price']}
Unique selling points: {$data['usp']}

REMINDER: Do not output anything outside the delimiters. No explanation, no markdown, no extra text.
PROMPT;
    }

    private function parseJsonResponse(string $text): array
    {
        $clean = preg_replace('/```json|```/i', '', $text);
        // If model used delimiters, extract between them first
        if (str_contains($clean, '<<<AI_JSON_START>>>') && str_contains($clean, '<<<AI_JSON_END>>>')) {
            $start = strpos($clean, '<<<AI_JSON_START>>>') + strlen('<<<AI_JSON_START>>>');
            $end = strrpos($clean, '<<<AI_JSON_END>>>');
            if ($end !== false && $end > $start) {
                $clean = substr($clean, $start, $end - $start);
            }
        }
        $clean = trim($clean);

        $decoded = json_decode($clean, true);

        // If direct decode failed, try to extract a JSON object substring
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            // attempt to find first '{' and last '}' and decode that substring
            $first = strpos($clean, '{');
            $last = strrpos($clean, '}');
            if ($first !== false && $last !== false && $last > $first) {
                $maybe = substr($clean, $first, $last - $first + 1);
                $maybeDecoded = json_decode($maybe, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($maybeDecoded)) {
                    $decoded = $maybeDecoded;
                }
            }
        }

        if (!is_array($decoded) || json_last_error() !== JSON_ERROR_NONE) {
            Log::error('JSON parse failed', ['raw' => $text]);
            $snippet = mb_substr($text, 0, 300);
            throw new Exception("AI returned invalid format. Response preview: {$snippet}...");
        }

        $required = ['headline', 'sub_headline', 'description', 'benefits', 'features', 'social_proof', 'pricing_text', 'cta_text'];
        foreach ($required as $key) {
            if (!isset($decoded[$key])) {
                throw new Exception("AI response missing required field: {$key}");
            }
        }

        return $decoded;
    }
}
