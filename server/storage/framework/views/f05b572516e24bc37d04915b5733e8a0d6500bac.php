
<?php $__env->startSection('title', 'Register – LawConnect'); ?>

<?php $__env->startSection('content'); ?>
<div class="max-w-md mx-auto bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8 mt-12 transform transition-all hover:scale-[1.02] duration-300">
    <div class="text-center mb-4">
        <img src="<?php echo e(asset('logo.jpeg')); ?>" alt="LawConnect Logo" style="height: 64px;" class="mx-auto">
    </div>
    <h2 class="text-2xl font-bold text-center mb-6">Create Account</h2>

    <form method="POST" action="<?php echo e(url('/auth/register')); ?>">
        <?php echo csrf_field(); ?>

        <div class="mb-4">
            <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
            <input type="text" name="name" id="name" value="<?php echo e(old('name')); ?>" required autofocus
                   class="w-full border rounded px-3 py-2">
        </div>

        <div class="mb-4">
            <label for="email" class="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" id="email" value="<?php echo e(old('email')); ?>" required
                   class="w-full border rounded px-3 py-2">
        </div>

        <div class="mb-4">
            <label for="phone" class="block text-sm font-medium mb-1">Phone <span class="text-gray-400">(optional)</span></label>
            <input type="text" name="phone" id="phone" value="<?php echo e(old('phone')); ?>"
                   class="w-full border rounded px-3 py-2">
        </div>

        <div class="mb-4">
            <label for="address" class="block text-sm font-medium mb-1">Address <span class="text-gray-400">(optional)</span></label>
            <textarea name="address" id="address" rows="2"
                      class="w-full border rounded px-3 py-2"><?php echo e(old('address')); ?></textarea>
        </div>

        <div class="mb-4">
            <label for="password" class="block text-sm font-medium mb-1">Password</label>
            <input type="password" name="password" id="password" required
                   class="w-full border rounded px-3 py-2">
        </div>

        <div class="mb-4">
            <label for="password_confirmation" class="block text-sm font-medium mb-1">Confirm Password</label>
            <input type="password" name="password_confirmation" id="password_confirmation" required
                   class="w-full border rounded px-3 py-2">
        </div>

        <button type="submit"
                class="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition">
            Register
        </button>
    </form>

    <p class="text-center text-sm text-gray-500 mt-4">
        Already have an account? <a href="<?php echo e(url('/login')); ?>" class="text-blue-600 hover:underline">Login</a>
    </p>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\user\Desktop\SD Project Backup\LawConnect\server\resources\views/auth/register.blade.php ENDPATH**/ ?>