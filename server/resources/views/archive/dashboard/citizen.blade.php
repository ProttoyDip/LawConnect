@extends('layouts.app')
@section('title', 'My Dashboard – LawConnect')

@section('content')
<div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">My Crime Reports</h1>
    <a href="{{ url('/crime-reports/create') }}"
       class="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition text-sm">
        + New Report
    </a>
</div>

@if($reports->isEmpty())
    <div class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        You have not submitted any reports yet.
    </div>
@else
    <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full text-sm">
            <thead class="bg-gray-50 text-left">
                <tr>
                    <th class="px-4 py-3">Case ID</th>
                    <th class="px-4 py-3">Title</th>
                    <th class="px-4 py-3">Category</th>
                    <th class="px-4 py-3">Status</th>
                    <th class="px-4 py-3">Priority</th>
                    <th class="px-4 py-3">Submitted</th>
                    <th class="px-4 py-3"></th>
                </tr>
            </thead>
            <tbody class="divide-y">
                @foreach($reports as $report)
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 font-mono text-xs">{{ Str::limit($report->case_id, 8) }}</td>
                    <td class="px-4 py-3">{{ $report->title }}</td>
                    <td class="px-4 py-3 capitalize">{{ $report->category }}</td>
                    <td class="px-4 py-3">
                        <span class="px-2 py-1 rounded text-xs font-medium
                            @if($report->status === 'pending') bg-yellow-100 text-yellow-800
                            @elseif($report->status === 'investigating') bg-blue-100 text-blue-800
                            @elseif($report->status === 'resolved') bg-green-100 text-green-800
                            @else bg-gray-100 text-gray-800
                            @endif">
                            {{ str_replace('_', ' ', $report->status) }}
                        </span>
                    </td>
                    <td class="px-4 py-3 capitalize">{{ $report->priority }}</td>
                    <td class="px-4 py-3">{{ $report->created_at->format('M d, Y') }}</td>
                    <td class="px-4 py-3">
                        <a href="{{ url("/crime-report/{$report->id}") }}" class="text-blue-600 hover:underline text-xs">View</a>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    @include('partials.pagination', ['paginator' => $reports])
@endif
@endsection
