
<nav class="bg-blue-900 text-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" class="text-xl font-bold tracking-wide">LawConnect</a>

        <div class="flex items-center space-x-4 text-sm">
            <?php if(auth()->guard()->check()): ?>
                <a href="<?php echo e(route('dashboard')); ?>" class="hover:underline">Dashboard</a>

                <?php if(auth()->user()->isAdmin()): ?>
                    <a href="#" class="hover:underline">Analytics</a>
                    <a href="#" class="hover:underline">Users</a>
                <?php endif; ?>

                <form method="POST" action="<?php echo e(url('/auth/logout')); ?>" class="inline">
                    <?php echo csrf_field(); ?>
                    <button type="submit" class="hover:underline">Logout</button>
                </form>

                <span class="bg-blue-700 px-2 py-1 rounded text-xs uppercase">
                    <?php echo e(auth()->user()->role?->name); ?>

                </span>
            <?php else: ?>
                <a href="<?php echo e(url('/login')); ?>" class="hover:underline">Login</a>
                <a href="<?php echo e(url('/register')); ?>" class="bg-white text-blue-900 px-3 py-1 rounded hover:bg-gray-200">Register</a>
            <?php endif; ?>
        </div>
    </div>
</nav>
<?php /**PATH C:\Users\user\Desktop\SD Project\cse-3100\cse-3100\server\resources\views/partials/nav.blade.php ENDPATH**/ ?>