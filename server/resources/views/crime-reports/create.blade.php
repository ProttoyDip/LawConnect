@extends('layouts.app')
@section('title', 'Submit Crime Report – LawConnect')

@section('content')
<div class="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
    <h2 class="text-2xl font-bold mb-6">Submit a Crime Report</h2>

    <form method="POST" action="{{ url('/api/crime-report') }}" enctype="multipart/form-data">
        @csrf

        <div class="mb-4">
            <label for="title" class="block text-sm font-medium mb-1">Title / Subject</label>
            <input type="text" name="title" id="title" value="{{ old('title') }}" required
                   class="w-full border rounded px-3 py-2" placeholder="Brief summary of the incident">
        </div>

        <div class="mb-4">
            <label for="category" class="block text-sm font-medium mb-1">Category</label>
            <select name="category" id="category" required class="w-full border rounded px-3 py-2">
                <option value="">-- Select --</option>
                <option value="theft"     {{ old('category') == 'theft'     ? 'selected' : '' }}>Theft</option>
                <option value="assault"   {{ old('category') == 'assault'   ? 'selected' : '' }}>Assault</option>
                <option value="fraud"     {{ old('category') == 'fraud'     ? 'selected' : '' }}>Fraud</option>
                <option value="vandalism" {{ old('category') == 'vandalism' ? 'selected' : '' }}>Vandalism</option>
                <option value="cyber"     {{ old('category') == 'cyber'     ? 'selected' : '' }}>Cyber Crime</option>
                <option value="other"     {{ old('category') == 'other'     ? 'selected' : '' }}>Other</option>
            </select>
        </div>

        <div class="mb-4">
            <label for="description" class="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" id="description" rows="5" required
                      class="w-full border rounded px-3 py-2"
                      placeholder="Describe the incident in detail…">{{ old('description') }}</textarea>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
                <label for="location" class="block text-sm font-medium mb-1">Location</label>
                <input type="text" name="location" id="location" value="{{ old('location') }}"
                       class="w-full border rounded px-3 py-2" placeholder="Where did it happen?">
            </div>
            <div>
                <label for="occurred_at" class="block text-sm font-medium mb-1">Date / Time of Incident</label>
                <input type="datetime-local" name="occurred_at" id="occurred_at" value="{{ old('occurred_at') }}"
                       class="w-full border rounded px-3 py-2">
            </div>
        </div>

        <div class="mb-4">
            <label for="priority" class="block text-sm font-medium mb-1">Priority</label>
            <select name="priority" id="priority" class="w-full border rounded px-3 py-2">
                <option value="low"      {{ old('priority') == 'low'      ? 'selected' : '' }}>Low</option>
                <option value="medium"   {{ old('priority', 'medium') == 'medium' ? 'selected' : '' }}>Medium</option>
                <option value="high"     {{ old('priority') == 'high'     ? 'selected' : '' }}>High</option>
                <option value="critical" {{ old('priority') == 'critical' ? 'selected' : '' }}>Critical</option>
            </select>
        </div>

        <div class="mb-6">
            <label class="block text-sm font-medium mb-1">Evidence (images / documents, max 5 files)</label>
            <input type="file" name="evidence[]" multiple accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.mp4,.avi"
                   class="w-full text-sm">
            <p class="text-xs text-gray-500 mt-1">Max 10 MB per file. Accepted: images, PDF, Word docs, videos.</p>
        </div>

        <button type="submit"
                class="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition">
            Submit Report
        </button>
    </form>
</div>
@endsection
