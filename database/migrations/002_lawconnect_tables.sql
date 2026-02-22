-- ============================================================
-- LawConnect – Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS `lawconnect` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lawconnect`;

-- ---------- Roles ----------
CREATE TABLE IF NOT EXISTS `roles` (
    `id`         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(50) NOT NULL UNIQUE COMMENT 'citizen | police | admin',
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------- Users ----------
CREATE TABLE IF NOT EXISTS `users` (
    `id`                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`              VARCHAR(255) NOT NULL,
    `email`             VARCHAR(255) NOT NULL UNIQUE,
    `email_verified_at` TIMESTAMP NULL,
    `password`          VARCHAR(255) NOT NULL,
    `role_id`           BIGINT UNSIGNED NOT NULL DEFAULT 1,
    `phone`             VARCHAR(20) NULL,
    `address`           TEXT NULL,
    `remember_token`    VARCHAR(100) NULL,
    `created_at`        TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------- Crime Reports ----------
CREATE TABLE IF NOT EXISTS `crime_reports` (
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `case_id`     CHAR(36) NOT NULL UNIQUE COMMENT 'UUID for public tracking',
    `user_id`     BIGINT UNSIGNED NOT NULL,
    `title`       VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category`    VARCHAR(100) NOT NULL COMMENT 'theft | assault | fraud | vandalism | cyber | other',
    `location`    VARCHAR(255) NULL,
    `occurred_at` DATETIME NULL,
    `status`      VARCHAR(50) NOT NULL DEFAULT 'pending' COMMENT 'pending | under_review | investigating | resolved | closed',
    `priority`    VARCHAR(20) NOT NULL DEFAULT 'medium' COMMENT 'low | medium | high | critical',
    `created_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reports_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Evidence Files ----------
CREATE TABLE IF NOT EXISTS `evidence_files` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `crime_report_id` BIGINT UNSIGNED NOT NULL,
    `file_path`       VARCHAR(500) NOT NULL,
    `file_type`       VARCHAR(50) NOT NULL COMMENT 'image | document | video | other',
    `original_name`   VARCHAR(255) NULL,
    `file_size`       INT UNSIGNED NULL COMMENT 'bytes',
    `uploaded_by`     BIGINT UNSIGNED NOT NULL,
    `created_at`      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_evidence_report` FOREIGN KEY (`crime_report_id`) REFERENCES `crime_reports`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_evidence_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Police Assignments ----------
CREATE TABLE IF NOT EXISTS `police_assignments` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `crime_report_id` BIGINT UNSIGNED NOT NULL,
    `officer_id`      BIGINT UNSIGNED NOT NULL,
    `assigned_by`     BIGINT UNSIGNED NOT NULL,
    `notes`           TEXT NULL,
    `assigned_at`     TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at`      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_assign_report`  FOREIGN KEY (`crime_report_id`) REFERENCES `crime_reports`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_assign_officer` FOREIGN KEY (`officer_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_assign_admin`   FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Case Status Updates ----------
CREATE TABLE IF NOT EXISTS `case_status_updates` (
    `id`              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `crime_report_id` BIGINT UNSIGNED NOT NULL,
    `status`          VARCHAR(50) NOT NULL,
    `remark`          TEXT NULL,
    `created_by`      BIGINT UNSIGNED NOT NULL,
    `created_at`      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`      TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_status_report`  FOREIGN KEY (`crime_report_id`) REFERENCES `crime_reports`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_status_creator` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------- Audit Logs ----------
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id`          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `actor_id`    BIGINT UNSIGNED NULL,
    `action`      VARCHAR(100) NOT NULL COMMENT 'created | updated | deleted | assigned | status_changed',
    `target_type` VARCHAR(100) NOT NULL COMMENT 'crime_report | evidence_file | police_assignment | user',
    `target_id`   BIGINT UNSIGNED NOT NULL,
    `meta`        JSON NULL COMMENT 'extra context as JSON',
    `ip_address`  VARCHAR(45) NULL,
    `created_at`  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------- Password Resets (Laravel standard) ----------
CREATE TABLE IF NOT EXISTS `password_resets` (
    `email`      VARCHAR(255) NOT NULL,
    `token`      VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL,
    INDEX `password_resets_email_index` (`email`)
) ENGINE=InnoDB;

-- ---------- Personal Access Tokens (Sanctum) ----------
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
    `id`             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `tokenable_type` VARCHAR(255) NOT NULL,
    `tokenable_id`   BIGINT UNSIGNED NOT NULL,
    `name`           VARCHAR(255) NOT NULL,
    `token`          VARCHAR(64) NOT NULL UNIQUE,
    `abilities`      TEXT NULL,
    `last_used_at`   TIMESTAMP NULL,
    `created_at`     TIMESTAMP NULL,
    `updated_at`     TIMESTAMP NULL,
    INDEX `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB;
