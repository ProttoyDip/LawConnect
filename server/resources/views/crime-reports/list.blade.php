@extends('layouts.app')
@section('title', 'All Crime Reports – LawConnect')

@section('content')
<h1 class="text-2xl font-bold mb-6">All Crime Reports</h1>

{{-- Filters --}}
<form method="GET" class="flex flex-wrap gap-3 mb-6">
    <select name="status" class="border rounded px-3 py-2 text-sm">
        <option value="">All Statuses</option>
        @foreach(['pending','under_review','investigating','resolved','closed'] as $s)
            <option value="{{ $s }}" {{ request('status') == $s ? 'selected' : '' }}>{{ ucfirst(str_replace('_', ' ', $s)) }}</option>
        @endforeach
    </select>
    <select name="category" class="border rounded px-3 py-2 text-sm">
        <option value="">All Categories</option>
        @foreach(['theft','assault','fraud','vandalism','cyber','other'] as $c)
            <option value="{{ $c }}" {{ request('category') == $c ? 'selected' : '' }}>{{ ucfirst($c) }}</option>
        @endforeach
    </select>
    <input type="text" name="search" value="{{ request('search') }}" placeholder="Search title / case ID…"
           class="border rounded px-3 py-2 text-sm w-48">
    <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800">Filter</button>
</form>

@if($reports->isEmpty())
    <div class="bg-white rounded-lg shadow p-8 text-center text-gray-500">No reports found.</div>
@else
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 text-left">
                <tr>
                    <th class="px-4 py-3">Case ID</th>
                    <th class="px-4 py-3">Title</th>
                    <th class="px-4 py-3">Reporter</th>
                    <th class="px-4 py-3">Category</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Priority</th>
                    <th class="px-4 py-3">Date</th>
                    <th class="px-4 py-3"></th>
                </tr>
            </thead>
            <tbody class="divide-y">
                @foreach($reports as $report)
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 font-mono text-xs">{{ Str::limit($report->case_id, 8) }}</td>
                    <td class="px-4 py-3">{{ $report->title }}</td>
                    <td class="px-4 py-3">{{ $report->user->name }}</td>
                    <td class="px-4 py-3 capitalize">{{ $report->category }}</td>
                    <td class="px-4 py-3 capitalize">{{ str_replace('_', ' ', $report->status) }}</td>
                    <td class="px-4 py-3 capitalize">{{ $report->priority }}</td>
                    <td class="px-4 py-3">{{ $report->created_at->format('M d') }}</td>
                    <td class="px-4 py-3"><a href="{{ url("/crime-report/{$report->id}") }}" class="text-blue-600 hover:underline text-xs">View</a></td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    @include('partials.pagination', ['paginator' => $reports])
@endif
@endsection
