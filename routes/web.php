<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SalesPageController;
use App\Http\Controllers\ExportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    $pages = auth()->user()->salesPages();
    return Inertia::render('Dashboard', [
        'stats' => [
            'total' => $pages->count(),
            'generated' => (clone $pages)->where('status', 'generated')->count(),
            'pending' => (clone $pages)->where('status', 'pending')->count(),
            'failed' => (clone $pages)->where('status', 'failed')->count(),
        ],
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
});

require __DIR__.'/auth.php';
