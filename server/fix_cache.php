<?php

$cacheDir = __DIR__ . '/bootstrap/cache';
$packagesFile = $cacheDir . '/packages.php';
$servicesFile = $cacheDir . '/services.json';

// Create directory if doesn't exist
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0755, true);
}

// Create packages.php
if (!is_writable($cacheDir)) {
    echo "ERROR: Cache directory is not writable: $cacheDir\n";
    exit(1);
}

file_put_contents($packagesFile, '<?php return array();');
file_put_contents($servicesFile, '{}');

echo "✓ Cache directory fixed\n";
