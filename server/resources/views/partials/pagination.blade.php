{{-- Simple pagination partial --}}
@if($paginator->hasPages())
    <nav class="flex justify-center mt-6">
        <div class="inline-flex space-x-1">
            {{-- Previous --}}
            @if($paginator->onFirstPage())
                <span class="px-3 py-1 bg-gray-200 text-gray-500 rounded">&laquo;</span>
            @else
                <a href="{{ $paginator->previousPageUrl() }}" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">&laquo;</a>
            @endif

            {{-- Page numbers --}}
            @foreach($paginator->getUrlRange(1, $paginator->lastPage()) as $page => $url)
                @if($page == $paginator->currentPage())
                    <span class="px-3 py-1 bg-blue-800 text-white rounded">{{ $page }}</span>
                @else
                    <a href="{{ $url }}" class="px-3 py-1 bg-white border rounded hover:bg-gray-100">{{ $page }}</a>
                @endif
            @endforeach

            {{-- Next --}}
            @if($paginator->hasMorePages())
                <a href="{{ $paginator->nextPageUrl() }}" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">&raquo;</a>
            @else
                <span class="px-3 py-1 bg-gray-200 text-gray-500 rounded">&raquo;</span>
            @endif
        </div>
    </nav>
@endif
