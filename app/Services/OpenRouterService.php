<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Exceptions\RateLimitException;
use Exception;

class OpenRouterService
{
    // Daftar model gratis dengan urutan prioritas
    // Kalau model pertama kena rate limit, otomatis fallback ke berikutnya
    const FREE_MODELS = [
        [
            'id'    => 'meta-llama/llama-3.3-70b-instruct:free',
            'label' => 'Llama 3.3 70B',
            'icon'  => '🦙',
        ],
        [
            'id'    => 'google/gemma-3-27b-it:free',
            'label' => 'Gemma 3 27B',
            'icon'  => '🔷',
        ],
        [
            'id'    => 'mistralai/mistral-small-3.1-24b-instruct:free',
            'label' => 'Mistral Small 3.1',
            'icon'  => '🌊',
        ],
        [
            'id'    => 'openrouter/free',
            'label' => 'OpenRouter Auto',
            'icon'  => '🔀',
        ],
    ];

    // Cache key prefix untuk rate limit status
    const CACHE_PREFIX = 'openrouter_limit_';

    // Berapa menit model dianggap "kena limit" sebelum dicoba lagi
    const COOLDOWN_MINUTES = 5;

    private string $apiKey;
    private string $apiUrl;
    private ?string $lastUsedModel = null;

    public function __construct()
    {
        $this->apiKey = (string) config('services.openrouter.key', '');
        $this->apiUrl = (string) config('services.openrouter.url', 'https://openrouter.ai/api/v1/chat/completions');

        if ($this->apiKey === '') {
            throw new \RuntimeException('OpenRouter API key is missing. Set OPENROUTER_API_KEY in your .env file.');
        }

        if ($this->apiUrl === '') {
            throw new \RuntimeException('OpenRouter API URL is missing. Set OPENROUTER_API_URL in your .env file.');
        }
    }

    /**
     * Generate sales page dengan auto-fallback jika model kena rate limit
     */
    public function generateSalesPage(array $productData): array
    {
        $prompt  = $this->buildPrompt($productData);
        $models  = $this->getAvailableModels(); // hanya model yang tidak sedang di-cooldown
        $errors  = [];

        if (empty($models)) {
            // Semua model sedang cooldown — reset semua dan coba lagi dari awal
            $this->resetAllCooldowns();
            $models = self::FREE_MODELS;
        }

        foreach ($models as $model) {
            try {
                $result = $this->callApi($model['id'], $prompt);
                $this->lastUsedModel = $model['id'];

                // Kalau berhasil, clear cooldown model ini (kalau ada)
                Cache::forget(self::CACHE_PREFIX . md5($model['id']));

                return $result;

            } catch (RateLimitException $e) {
                // Tandai model ini kena rate limit, cooldown 5 menit
                $this->markRateLimited($model['id']);
                $errors[] = "[{$model['label']}] rate limited, trying next model...";
                Log::warning("OpenRouter rate limit on {$model['id']}, falling back.");
                continue; // coba model berikutnya

            } catch (Exception $e) {
                $errors[] = "[{$model['label']}] {$e->getMessage()}";
                Log::error("OpenRouter error on {$model['id']}: {$e->getMessage()}");
                continue;
            }
        }

        // Semua model gagal
        throw new Exception('All AI models are currently unavailable. Please try again in a few minutes.');
    }

    /**
     * Panggil OpenRouter API untuk satu model
     */
    private function callApi(string $modelId, string $prompt): array
    {
        $response = Http::timeout(60)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type'  => 'application/json',
                'HTTP-Referer'  => config('app.url'),
                'X-Title'       => config('app.name'),
            ])
            ->post($this->apiUrl, [
                'model'       => $modelId,
                'messages'    => [
                    [
                        'role'    => 'system',
                        'content' => 'You are an expert marketing copywriter. Always respond with valid JSON only. No markdown, no explanation.',
                    ],
                    [
                        'role'    => 'user',
                        'content' => $prompt,
                    ],
                ],
                'max_tokens'  => 2000,
                'temperature' => 0.7,
            ]);

        // Rate limit
        if ($response->status() === 429) {
            throw new RateLimitException("Rate limit hit for model: {$modelId}");
        }

        if (!$response->successful()) {
            throw new Exception("HTTP {$response->status()}: {$response->body()}");
        }

        $text = $response->json('choices.0.message.content');

        if (!$text) {
            throw new Exception('Empty response from API.');
        }

        return $this->parseJsonResponse($text);
    }

    /**
     * Kembalikan status semua model (untuk ditampilkan di UI)
     */
    public function getModelsStatus(): array
    {
        return array_map(function ($model) {
            $cacheKey    = self::CACHE_PREFIX . md5($model['id']);
            $limitedUntil = Cache::get($cacheKey);
            $isLimited   = $limitedUntil && now()->lessThan($limitedUntil);

            return [
                'id'            => $model['id'],
                'label'         => $model['label'],
                'icon'          => $model['icon'],
                'status'        => $isLimited ? 'limited' : 'available',
                'available_at'  => $isLimited
                    ? $limitedUntil->diffForHumans()
                    : null,
            ];
        }, self::FREE_MODELS);
    }

    /**
     * Hanya kembalikan model yang tidak sedang cooldown
     */
    private function getAvailableModels(): array
    {
        return array_filter(self::FREE_MODELS, function ($model) {
            $cacheKey     = self::CACHE_PREFIX . md5($model['id']);
            $limitedUntil = Cache::get($cacheKey);
            return !$limitedUntil || now()->greaterThanOrEqualTo($limitedUntil);
        });
    }

    /**
     * Tandai model kena rate limit selama COOLDOWN_MINUTES
     */
    private function markRateLimited(string $modelId): void
    {
        $until    = now()->addMinutes(self::COOLDOWN_MINUTES);
        $cacheKey = self::CACHE_PREFIX . md5($modelId);
        Cache::put($cacheKey, $until, $until);
    }

    /**
     * Reset semua cooldown (dipakai kalau semua model habis)
     */
    private function resetAllCooldowns(): void
    {
        foreach (self::FREE_MODELS as $model) {
            Cache::forget(self::CACHE_PREFIX . md5($model['id']));
        }
    }

    public function getLastUsedModel(): ?string
    {
        return $this->lastUsedModel;
    }

    private function buildPrompt(array $data): string
    {
        $featuresText = is_array($data['features'])
            ? implode(', ', $data['features'])
            : $data['features'];

        return <<<PROMPT
Generate a complete sales page for the product below.

Return ONLY a valid JSON object with exactly these keys:
{
  "headline": "compelling benefit-driven headline, max 12 words",
  "sub_headline": "supporting headline with context, max 20 words",
  "description": "2-3 persuasive paragraphs about the product",
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
  "features": [
    {"title": "Feature Name", "detail": "one sentence explanation"},
    {"title": "Feature Name", "detail": "one sentence explanation"},
    {"title": "Feature Name", "detail": "one sentence explanation"}
  ],
  "social_proof": "realistic placeholder testimonial with name and role",
  "pricing_text": "pricing summary mentioning the price and value",
  "cta_text": "call-to-action button text, max 6 words"
}

Product name: {$data['product_name']}
Description: {$data['description']}
Key features: {$featuresText}
Target audience: {$data['target_audience']}
Price: {$data['price']}
Unique selling points: {$data['usp']}

IMPORTANT: Return ONLY the JSON object. No markdown. No \`\`\`json. No explanation.
PROMPT;
    }

    private function parseJsonResponse(string $text): array
    {
        $clean = preg_replace('/```json|```/i', '', $text);
        $clean = trim($clean);

        $start = strpos($clean, '{');
        $end   = strrpos($clean, '}');

        if ($start === false || $end === false) {
            throw new Exception('No valid JSON object found in AI response.');
        }

        $jsonOnly = substr($clean, $start, $end - $start + 1);
        $decoded  = json_decode($jsonOnly, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('AI returned malformed JSON: ' . json_last_error_msg());
        }

        $required = ['headline', 'sub_headline', 'description', 'benefits', 'features', 'social_proof', 'pricing_text', 'cta_text'];
        foreach ($required as $key) {
            if (!isset($decoded[$key])) {
                throw new Exception("AI response missing field: {$key}");
            }
        }

        return $decoded;
    }
}