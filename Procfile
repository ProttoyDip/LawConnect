release: cd server && composer install --no-dev && php artisan config:cache && php artisan route:cache && php artisan migrate --force
web: cd server && php -S 0.0.0.0:${PORT:-8000} -t public public/index.php
