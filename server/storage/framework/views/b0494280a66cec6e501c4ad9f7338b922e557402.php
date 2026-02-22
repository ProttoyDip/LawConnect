
<?php $__env->startSection('title', 'Login – LawConnect'); ?>

<?php $__env->startSection('content'); ?>
<div class="max-w-md mx-auto bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 mt-12 transform transition-all hover:scale-[1.02] duration-300">
    <div class="text-center mb-4">
        <img src="<?php echo e(asset('logo.jpeg')); ?>" alt="LawConnect Logo" style="height: 64px;" class="mx-auto">
    </div>
    <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

    <form method="POST" action="<?php echo e(url('/auth/login')); ?>">
        <?php echo csrf_field(); ?>

        <div class="mb-4">
            <label for="email" class="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" id="email" value="<?php echo e(old('email')); ?>" required autofocus
                   class="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <div class="mb-4">
            <label for="password" class="block text-sm font-medium mb-1">Password</label>
            <input type="password" name="password" id="password" required
                   class="w-full border rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <button type="submit"
                class="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition">
            Login
        </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-4">
        Don't have an account? <a href="<?php echo e(url('/register')); ?>" class="text-blue-600 hover:underline">Register</a>
    </p>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\user\Desktop\SD Project Backup\LawConnect\server\resources\views/auth/login.blade.php ENDPATH**/ ?>