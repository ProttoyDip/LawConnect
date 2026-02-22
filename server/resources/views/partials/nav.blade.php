{{-- Responsive top navigation --}}
<nav class="bg-blue-900 text-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" class="text-xl font-bold tracking-wide">LawConnect</a>

        <div class="flex items-center space-x-4 text-sm">
            @auth
                <a href="{{ route('dashboard') }}" class="hover:underline">Dashboard</a>

                @if(auth()->user()->isAdmin())
                    <a href="#" class="hover:underline">Analytics</a>
                    <a href="#" class="hover:underline">Users</a>
                @endif

                <form method="POST" action="{{ url('/auth/logout') }}" class="inline">
                    @csrf
                    <button type="submit" class="hover:underline">Logout</button>
                </form>

                <span class="bg-blue-700 px-2 py-1 rounded text-xs uppercase">
                    {{ auth()->user()->role?->name }}
                </span>
            @else
                <a href="{{ url('/login') }}" class="hover:underline">Login</a>
                <a href="{{ url('/register') }}" class="bg-white text-blue-900 px-3 py-1 rounded hover:bg-gray-200">Register</a>
            @endauth
        </div>
    </div>
</nav>
