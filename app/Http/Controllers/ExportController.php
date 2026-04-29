<?php

namespace App\Http\Controllers;

use App\Models\SalesPage;

class ExportController extends Controller
{
    public function html(SalesPage $page)
    {
        $this->authorize('view', $page);

        if ($page->status !== 'generated') {
            return back()->withErrors(['export' => 'This page has no generated content yet.']);
        }

        $html = view('exports.sales-page-html', ['page' => $page])->render();
        $filename = str($page->product_name)->slug() . '-sales-page.html';

        return response($html)
            ->header('Content-Type', 'text/html')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}
