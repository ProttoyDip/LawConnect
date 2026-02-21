<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'LawConnect')</title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    @stack('styles')
</head>
<body class="min-h-screen bg-gray-100 text-gray-800">

    {{-- Navigation --}}
    @include('partials.nav')

    {{-- Flash Messages --}}
    @include('partials.flash')

    {{-- Page Content --}}
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @yield('content')
    </main>

    {{-- Footer --}}
    <footer class="text-center text-gray-500 text-sm py-6 border-t mt-8">
        &copy; {{ date('Y') }} LawConnect &mdash; One click can make a difference.
    </footer>

    @stack('scripts')
</body>
</html>
