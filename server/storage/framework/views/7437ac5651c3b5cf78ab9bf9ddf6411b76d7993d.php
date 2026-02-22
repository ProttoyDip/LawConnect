

<?php $__env->startSection('title', 'LawConnect – Report Crime Safely'); ?>

<?php $__env->startSection('content'); ?>
<div class="text-center py-16">
    <h1 class="text-4xl font-extrabold text-blue-900 mb-4">Welcome to LawConnect</h1>
    <p class="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        A secure, web-based platform where citizens can report crimes, upload evidence,
        and track progress &mdash; while law enforcement manages investigations efficiently.
    </p>

    <div class="flex justify-center space-x-4">
        <?php if(auth()->guard()->check()): ?>
            <a href="<?php echo e(route('dashboard')); ?>"
               class="bg-blue-700 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-800 transition">
                Go to Dashboard
            </a>
        <?php else: ?>
            <a href="<?php echo e(url('/register')); ?>"
               class="bg-blue-700 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-800 transition">
                Report a Crime
            </a>
            <a href="<?php echo e(url('/login')); ?>"
               class="border border-blue-700 text-blue-700 px-6 py-3 rounded-lg text-lg hover:bg-blue-50 transition">
                Login
            </a>
        <?php endif; ?>
    </div>
</div>


<section class="grid md:grid-cols-3 gap-6 mt-12">
    <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl mb-3">&#128221;</div>
        <h3 class="font-bold text-lg mb-2">Easy Reporting</h3>
        <p class="text-gray-600 text-sm">Submit detailed crime reports with evidence from anywhere, anytime.</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl mb-3">&#128270;</div>
        <h3 class="font-bold text-lg mb-2">Real-Time Tracking</h3>
        <p class="text-gray-600 text-sm">Track the status of your complaints with a unique case ID.</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6 text-center">
        <div class="text-3xl mb-3">&#128274;</div>
        <h3 class="font-bold text-lg mb-2">Secure & Transparent</h3>
        <p class="text-gray-600 text-sm">Role-based access and audit logging ensure accountability.</p>
    </div>
</section>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH C:\Users\user\Desktop\SD Project\cse-3100\cse-3100\server\resources\views/welcome.blade.php ENDPATH**/ ?>