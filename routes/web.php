<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesPageController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ModelStatusController;
use App\Services\OpenRouterService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    $openRouter = app(OpenRouterService::class);
    return Inertia::render('Dashboard', [
        'stats' => [
            'total' => auth()->user()->salesPages()->count(),
            'generated' => auth()->user()->salesPages()->where('status', 'generated')->count(),
            'pending' => auth()->user()->salesPages()->where('status', 'pending')->count(),
            'failed' => auth()->user()->salesPages()->where('status', 'failed')->count(),
        ],
        'worker' => [
            'active' => (bool) Cache::get('queue-worker:sales-pages:active', false),
            'last_seen' => Cache::get('queue-worker:sales-pages:last_seen'),
            'fresh' => filled(Cache::get('queue-worker:sales-pages:last_seen'))
                ? Carbon::parse(Cache::get('queue-worker:sales-pages:last_seen'))->diffInSeconds(now()) <= 45
                : false,
            'queue' => 'sales-pages,default',
        ],
        'models' => $openRouter->getModelsStatus(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Sales Page routes
    Route::get('/pages/create', [SalesPageController::class, 'create'])->name('pages.create');
    Route::post('/pages', [SalesPageController::class, 'store'])->name('pages.store');
    Route::get('/pages/{page}', [SalesPageController::class, 'show'])->name('pages.show');
    Route::delete('/pages/{page}', [SalesPageController::class, 'destroy'])->name('pages.destroy');
    Route::post('/pages/{page}/regenerate', [SalesPageController::class, 'regenerate'])->name('pages.regenerate');
    Route::get('/history', [SalesPageController::class, 'history'])->name('pages.history');

    // Export
    Route::get('/pages/{page}/export', [ExportController::class, 'html'])->name('pages.export');

    Route::get('/ai/model-status', [ModelStatusController::class, 'index'])->name('ai.model-status');
});

require __DIR__.'/auth.php';
