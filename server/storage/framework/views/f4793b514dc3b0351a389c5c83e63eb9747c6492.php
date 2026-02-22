<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <title><?php echo $__env->yieldContent('title', 'LawConnect'); ?></title>

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <?php echo $__env->yieldPushContent('styles'); ?>
</head>
<body class="min-h-screen bg-gray-100 text-gray-800">

    
    <?php echo $__env->make('partials.nav', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    
    <?php echo $__env->make('partials.flash', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>

    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <?php echo $__env->yieldContent('content'); ?>
    </main>

    
    <footer class="text-center text-gray-500 text-sm py-6 border-t mt-8">
        &copy; <?php echo e(date('Y')); ?> LawConnect &mdash; One click can make a difference.
    </footer>

    <?php echo $__env->yieldPushContent('scripts'); ?>
</body>
</html>
<?php /**PATH C:\Users\user\Desktop\SD Project\cse-3100\cse-3100\server\resources\views/layouts/app.blade.php ENDPATH**/ ?>