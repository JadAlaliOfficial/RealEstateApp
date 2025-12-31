<?php

namespace App\Http\Controllers;

use App\Http\Requests\NoticeRequest;
use App\Models\Notice;
use App\Services\NoticeService;
use Inertia\Inertia;

class NoticeController extends Controller
{
    protected $service;

    public function __construct(NoticeService $service)
    {
        $this->service = $service;

        $this->middleware('permission:notices.index')->only('index');
        $this->middleware('permission:notices.create')->only('create');
        $this->middleware('permission:notices.store')->only('store');
        $this->middleware('permission:notices.show')->only('show');
        $this->middleware('permission:notices.edit')->only('edit');
        $this->middleware('permission:notices.update')->only('update');
        $this->middleware('permission:notices.destroy')->only('destroy');
    }

    public function index()
    {
        $notices = $this->service->listAll();
        return Inertia::render('Notices/Index', ['notices' => $notices]);
    }

    public function create()
    {
        return Inertia::render('Notices/Create');
    }

    public function store(NoticeRequest $request)
    {
        $this->service->create($request->validated());
        return redirect()->route('notices.index')->with('success', 'Notice created successfully.');
    }



    public function edit(Notice $notice)
    {
        // Ensure we can only edit active notices
        if ($notice->is_archived) {
            return redirect()->route('notices.index')->with('error', 'Cannot edit archived notice.');
        }
        return Inertia::render('Notices/Edit', ['notice' => $notice]);
    }

    public function update(NoticeRequest $request, Notice $notice)
    {
        // Ensure we can only update active notices
        if ($notice->is_archived) {
            return redirect()->route('notices.index')->with('error', 'Cannot update archived notice.');
        }
        $this->service->update($notice, $request->validated());
        return redirect()->route('notices.index', $notice->id)->with('success', 'Notice updated successfully.');
    }

    public function destroy(Notice $notice)
    {
        $this->service->delete($notice);
        return redirect()->route('notices.index')->with('success', 'Notice archived successfully.');
    }
}
