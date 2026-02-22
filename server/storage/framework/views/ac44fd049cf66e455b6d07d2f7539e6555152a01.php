
<?php if(session('success')): ?>
    <div class="max-w-7xl mx-auto mt-4 px-4">
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <?php echo e(session('success')); ?>

        </div>
    </div>
<?php endif; ?>

<?php if(session('error')): ?>
    <div class="max-w-7xl mx-auto mt-4 px-4">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <?php echo e(session('error')); ?>

        </div>
    </div>
<?php endif; ?>

<?php if($errors->any()): ?>
    <div class="max-w-7xl mx-auto mt-4 px-4">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <ul class="list-disc list-inside text-sm">
                <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <li><?php echo e($error); ?></li>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </ul>
        </div>
    </div>
<?php endif; ?>
<?php /**PATH C:\Users\user\Desktop\SD Project Backup\LawConnect\server\resources\views/partials/flash.blade.php ENDPATH**/ ?>