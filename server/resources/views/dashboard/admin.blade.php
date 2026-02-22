@extends('layouts.app')
@section('title', 'Admin Dashboard – LawConnect')

@section('content')
<h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

{{-- Stats Cards --}}
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div class="bg-white rounded-lg shadow p-5 text-center">
        <div class="text-3xl font-bold text-blue-700">{{ $analytics['total_reports'] }}</div>
        <div class="text-sm text-gray-500">Total Reports</div>
    </div>
    <div class="bg-white rounded-lg shadow p-5 text-center">
        <div class="text-3xl font-bold text-yellow-600">{{ $analytics['pending_reports'] }}</div>
        <div class="text-sm text-gray-500">Pending</div>
    </div>
    <div class="bg-white rounded-lg shadow p-5 text-center">
        <div class="text-3xl font-bold text-blue-500">{{ $analytics['investigating'] }}</div>
        <div class="text-sm text-gray-500">Investigating</div>
    </div>
    <div class="bg-white rounded-lg shadow p-5 text-center">
        <div class="text-3xl font-bold text-green-600">{{ $analytics['resolved_reports'] }}</div>
        <div class="text-sm text-gray-500">Resolved</div>
    </div>
</div>

{{-- By Category --}}
<div class="grid md:grid-cols-2 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow p-6">
        <h3 class="font-bold mb-4">Reports by Category</h3>
        <ul class="space-y-2 text-sm">
            @foreach($analytics['by_category'] as $category => $count)
                <li class="flex justify-between capitalize">
                    <span>{{ $category }}</span>
                    <span class="font-semibold">{{ $count }}</span>
                </li>
            @endforeach
        </ul>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
        <h3 class="font-bold mb-4">Reports by Priority</h3>
        <ul class="space-y-2 text-sm">
            @foreach($analytics['by_priority'] as $priority => $count)
                <li class="flex justify-between capitalize">
                    <span>{{ $priority }}</span>
                    <span class="font-semibold">{{ $count }}</span>
                </li>
            @endforeach
        </ul>
    </div>
</div>

{{-- Quick Stats --}}
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
    <div class="bg-white rounded-lg shadow p-5 text-center">
        <div class="text-2xl font-bold">{{ $analytics['total_users'] }}</div>
        <div class="text-sm text-gray-500">Total Users</div>
    </div>
    <div class="bg-white rounded-lg shadow p-5 text-center">
        <div class="text-2xl font-bold">{{ $analytics['total_officers'] }}</div>
        <div class="text-sm text-gray-500">Police Officers</div>
    </div>
    <div class="bg-white rounded-lg shadow p-5 text-center">
        <div class="text-2xl font-bold text-gray-600">{{ $analytics['closed_reports'] }}</div>
        <div class="text-sm text-gray-500">Closed</div>
    </div>
</div>

{{-- Recent Reports --}}
<div class="bg-white rounded-lg shadow overflow-hidden">
    <h3 class="font-bold px-4 py-3 bg-gray-50">Recent Reports</h3>
    <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
            <tr>
                <th class="px-4 py-2">Case ID</th>
                <th class="px-4 py-2">Title</th>
                <th class="px-4 py-2">By</th>
                <th class="px-4 py-2">Status</th>
                <th class="px-4 py-2">Date</th>
            </tr>
        </thead>
        <tbody class="divide-y">
            @foreach($analytics['recent_reports'] as $report)
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-2 font-mono text-xs">{{ Str::limit($report->case_id, 8) }}</td>
                <td class="px-4 py-2">{{ $report->title }}</td>
                <td class="px-4 py-2">{{ $report->user->name }}</td>
                <td class="px-4 py-2 capitalize">{{ str_replace('_', ' ', $report->status) }}</td>
                <td class="px-4 py-2">{{ $report->created_at->format('M d, Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
