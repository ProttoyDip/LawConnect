-- ============================================================
-- LawConnect – Seed Data
-- ============================================================

USE `lawconnect`;

-- ---------- Default Roles ----------
INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'citizen'),
(2, 'police'),
(3, 'admin')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ---------- Demo Users (password = 'password' hashed with bcrypt) ----------
INSERT INTO `users` (`name`, `email`, `password`, `role_id`, `email_verified_at`) VALUES
('Admin User',   'admin@lawconnect.com',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, NOW()),
('Officer Khan', 'officer@lawconnect.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, NOW()),
('Jane Citizen', 'citizen@lawconnect.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, NOW());
