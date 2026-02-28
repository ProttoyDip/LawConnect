# Archived Blade Templates

These Blade templates have been migrated to React. They are kept here for reference only.

## Migrated Files

### Authentication
- `auth/login.blade.php` → React: `client/src/views/Login.tsx`
- `auth/register.blade.php` → React: `client/src/views/Register.tsx`
- `auth/forgot-password.blade.php` - Not yet migrated
- `auth/reset-password.blade.php` - Not yet migrated

### Dashboards
- `dashboard/admin.blade.php` → React: `client/src/views/AdminDashboard.tsx`
- `dashboard/citizen.blade.php` → React: `client/src/views/Dashboard.tsx`
- `dashboard/police.blade.php` → React: `client/src/views/ReportList.tsx`

### Crime Reports
- `crime-reports/create.blade.php` → React: `client/src/views/ReportCrime.tsx`
- `crime-reports/list.blade.php` → React: `client/src/views/ReportList.tsx`
- `crime-reports/show.blade.php` - Not yet migrated

### Layouts
- `layouts/app.blade.php` → React: `client/src/views/BaseLayout.tsx`
- `partials/nav.blade.php` → React: `client/src/views/BaseLayout.tsx`
- `partials/flash.blade.php` → React: Uses react-hot-toast
- `partials/pagination.blade.php` → React: Uses Bootstrap pagination

### Public Pages
- `welcome.blade.php` → React: `client/src/views/Home.tsx`

## Status

The Laravel backend now serves as an API-only application. All client-facing pages are handled by the React frontend.
