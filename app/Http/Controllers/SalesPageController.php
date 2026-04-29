<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateSalesPageJob;
use App\Http\Requests\GeneratePageRequest;
use App\Models\SalesPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesPageController extends Controller
{
    public function create()
    {
        return Inertia::render('SalesPages/Create');
    }

    public function store(GeneratePageRequest $request)
    {
        $page = SalesPage::create([
            ...$request->validated(),
            'user_id' => auth()->id(),
            'features' => array_filter(array_map('trim', explode(',', $request->features))),
            'status' => 'pending',
        ]);

        GenerateSalesPageJob::dispatch($page->id);

        return redirect()->route('pages.show', $page)->with('success', 'Sales page is being generated in the background.');
    }

    public function show(SalesPage $page)
    {
        $this->authorize('view', $page);
        return Inertia::render('SalesPages/Show', ['page' => $page]);
    }

    public function history(Request $request)
    {
        $pages = auth()->user()->salesPages()
            ->when($request->search, fn($q) => $q->where('product_name', 'ilike', "%{$request->search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SalesPages/History', [
            'pages' => $pages,
            'filters' => $request->only('search'),
        ]);
    }

    public function destroy(SalesPage $page)
    {
        $this->authorize('delete', $page);
        $page->delete();
        return redirect()->route('pages.history')->with('success', 'Page deleted.');
    }

    public function regenerate(SalesPage $page)
    {
        $this->authorize('update', $page);

        $page->update(['status' => 'pending']);
        GenerateSalesPageJob::dispatch($page->id);

        return redirect()->route('pages.show', $page)->with('success', 'Page regeneration queued in the background.');
    }
}
