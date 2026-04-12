release: cd server && composer install --no-dev && php artisan config:cache && php artisan route:cache && php artisan migrate --force
web: cd server && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
