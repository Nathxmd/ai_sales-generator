<?php

namespace App\Jobs;

use App\Models\SalesPage;
use App\Services\GeminiService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateSalesPageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public int $salesPageId)
    {
        $this->onQueue('sales-pages');
    }

    public function backoff(): array
    {
        return [5, 15, 30];
    }

    public function handle(GeminiService $gemini): void
    {
        $page = SalesPage::query()->find($this->salesPageId);

        if (! $page) {
            return;
        }

        if ($page->status === 'generated') {
            return;
        }

        try {
            $content = $gemini->generateSalesPage($page->toArray());

            $page->update([
                'generated_content' => $content,
                'status' => 'generated',
            ]);
        } catch (\Throwable $e) {
            Log::error('Sales page generation job failed', [
                'sales_page_id' => $page->id,
                'error' => $e->getMessage(),
            ]);

            $page->update([
                'status' => 'failed',
            ]);

            throw $e;
        }
    }
}