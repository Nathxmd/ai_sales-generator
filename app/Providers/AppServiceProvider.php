<?php

namespace App\Providers;

use App\Models\SalesPage;
use App\Policies\SalesPagePolicy;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (app()->environment('production')) {
        URL::forceScheme('https');
    }
        Vite::prefetch(concurrency: 3);

        Gate::policy(SalesPage::class, SalesPagePolicy::class);

        Queue::looping(function (): void {
            Cache::put('queue-worker:sales-pages:active', true, now()->addSeconds(30));
            Cache::put('queue-worker:sales-pages:last_seen', now()->toDateTimeString(), now()->addSeconds(30));
        });
    }
}
