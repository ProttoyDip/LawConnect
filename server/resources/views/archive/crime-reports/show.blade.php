@extends('layouts.app')
@section('title', 'Case ' . Str::limit($report->case_id, 8) . ' – LawConnect')

@section('content')
<div class="max-w-3xl mx-auto">
    {{-- Header --}}
    <div class="flex items-center justify-between mb-6">
        <div>
            <h1 class="text-2xl font-bold">{{ $report->title }}</h1>
            <p class="text-gray-500 text-sm">Case&nbsp;ID: <span class="font-mono">{{ $report->case_id }}</span></p>
        </div>
        <span class="px-3 py-1 rounded text-sm font-medium
            @if($report->status === 'pending') bg-yellow-100 text-yellow-800
            @elseif($report->status === 'investigating') bg-blue-100 text-blue-800
            @elseif($report->status === 'resolved') bg-green-100 text-green-800
            @else bg-gray-100 text-gray-800
            @endif">
            {{ str_replace('_', ' ', $report->status) }}
        </span>
    </div>

    {{-- Details --}}
    <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid md:grid-cols-2 gap-4 text-sm mb-4">
            <div><strong>Category:</strong> <span class="capitalize">{{ $report->category }}</span></div>
            <div><strong>Priority:</strong> <span class="capitalize">{{ $report->priority }}</span></div>
            <div><strong>Location:</strong> {{ $report->location ?? 'N/A' }}</div>
            <div><strong>Occurred:</strong> {{ $report->occurred_at?->format('M d, Y h:i A') ?? 'N/A' }}</div>
            <div><strong>Reported by:</strong> {{ $report->user->name }}</div>
            <div><strong>Submitted:</strong> {{ $report->created_at->format('M d, Y') }}</div>
        </div>
        <hr class="my-4">
        <p class="text-gray-700 whitespace-pre-line">{{ $report->description }}</p>
    </div>

    {{-- Evidence --}}
    @if($report->evidenceFiles->count())
    <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="font-bold mb-3">Evidence ({{ $report->evidenceFiles->count() }})</h3>
        <ul class="space-y-2 text-sm">
            @foreach($report->evidenceFiles as $file)
                <li class="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{{ $file->original_name ?? basename($file->file_path) }} ({{ $file->file_type }})</span>
                    <a href="{{ asset('storage/' . $file->file_path) }}" target="_blank"
                       class="text-blue-600 hover:underline">Download</a>
                </li>
            @endforeach
        </ul>
    </div>
    @endif

    {{-- Status Timeline --}}
    @if($report->statusUpdates->count())
    <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="font-bold mb-3">Status Timeline</h3>
        <ol class="border-l-2 border-blue-300 ml-3 space-y-4">
            @foreach($report->statusUpdates as $update)
            <li class="ml-4">
                <div class="absolute -left-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                <div class="text-sm">
                    <span class="font-semibold capitalize">{{ str_replace('_', ' ', $update->status) }}</span>
                    <span class="text-gray-400 ml-2">{{ $update->created_at->diffForHumans() }}</span>
                    <span class="text-gray-400">by {{ $update->creator->name }}</span>
                </div>
                @if($update->remark)
                    <p class="text-gray-600 text-xs mt-1">{{ $update->remark }}</p>
                @endif
            </li>
            @endforeach
        </ol>
    </div>
    @endif

    <a href="{{ url()->previous() }}" class="text-blue-600 hover:underline text-sm">&larr; Back</a>
</div>
@endsection
