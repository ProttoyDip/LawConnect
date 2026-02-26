@extends('layouts.app')
@section('title', 'Forgot Password – LawConnect')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
    <div class="max-w-md w-full">
        <!-- Logo/Brand -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            </div>
            <h1 class="text-3xl font-bold text-white">LawConnect</h1>
            <p class="text-slate-400 mt-2">Reset Your Password</p>
        </div>

        <!-- Forgot Password Card -->
        <div class="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div class="p-8">
                <p class="text-sm text-slate-600 mb-6">
                    Forgot your password? No problem. Just enter your email address and we'll send you a link to reset your password.
                </p>

                <!-- Session Status -->
                @if (session('status'))
                    <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        {{ session('status') }}
                    </div>
                @endif

                <form method="POST" action="{{ route('password.email') }}">
                    @csrf

                    <div class="mb-5">
                        <label for="email" class="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                        <input type="email" 
                               name="email" 
                               id="email" 
                               value="{{ old('email') }}" 
                               required 
                               autofocus
                               class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 @error('email') border-red-500 @enderror"
                               placeholder="Enter your email">
                        @error('email')
                            <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <button type="submit"
                            class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02] shadow-lg">
                        Send Password Reset Link
                    </button>
                </form>

                <div class="mt-6 pt-6 border-t border-slate-200 text-center">
                    <p class="text-sm text-slate-600">
                        Remember your password? 
                        <a href="{{ route('login') }}" class="text-blue-600 hover:text-blue-800 font-medium transition">
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <p class="text-center text-slate-500 text-sm mt-8">
            &copy; {{ date('Y') }} LawConnect — One click can make a difference.
        </p>
    </div>
</div>
@endsection
