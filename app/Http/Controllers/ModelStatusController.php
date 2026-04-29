<?php

namespace App\Http\Controllers;

use App\Services\OpenRouterService;

class ModelStatusController extends Controller
{
    public function index(OpenRouterService $service)
    {
        return response()->json([
            'models' => $service->getModelsStatus(),
            'checked_at' => now()->toTimeString(),
        ]);
    }
}