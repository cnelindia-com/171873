-- Adminer 5.3.0 MariaDB 10.11.13-MariaDB dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `audit_logs`;
CREATE TABLE `audit_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `action_type` varchar(255) NOT NULL,
  `reference_id` bigint(20) unsigned DEFAULT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_index` (`user_id`),
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `leads`;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facility_id` int(11) DEFAULT NULL,
  `place_id` int(11) DEFAULT NULL,
  `visitor_name` varchar(256) DEFAULT NULL,
  `visitor_email` varchar(256) DEFAULT NULL,
  `visitor_phone` bigint(20) DEFAULT NULL,
  `requested_care_type` int(11) DEFAULT NULL,
  `message` varchar(256) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `status` varchar(256) DEFAULT 'new',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `stripe_customer_id` varchar(255) DEFAULT NULL,
  `stripe_subscription_id` varchar(255) DEFAULT NULL,
  `stripe_invoice_id` varchar(255) DEFAULT NULL,
  `stripe_payment_intent` varchar(255) DEFAULT NULL,
  `plan_name` varchar(255) DEFAULT NULL,
  `price_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `currency` varchar(10) DEFAULT 'usd',
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `place_images`;
CREATE TABLE `place_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `place_id` int(11) NOT NULL,
  `file_url` text NOT NULL,
  `storage_path` text NOT NULL,
  `alt_text` text NOT NULL,
  `order_index` text NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `spots`;
CREATE TABLE `spots` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `name_of_the_place` varchar(255) NOT NULL,
  `room_type` varchar(255) NOT NULL,
  `care_level` varchar(255) NOT NULL,
  `availability` varchar(255) NOT NULL,
  `available_from` varchar(255) DEFAULT NULL,
  `available_spots` varchar(255) DEFAULT NULL,
  `price_per_month` varchar(255) NOT NULL,
  `priority_score` varchar(255) DEFAULT NULL,
  `plan_level_cached` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `address_street` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `desc` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`desc`)),
  `user_id` int(11) NOT NULL,
  `status` varchar(256) DEFAULT NULL,
  `is_featured` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `facility_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `address_street` varchar(100) DEFAULT NULL,
  `address_postcode` varchar(100) DEFAULT NULL,
  `address_city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `stripe_customer_id` varchar(100) DEFAULT NULL,
  `current_period_end` varchar(100) DEFAULT NULL,
  `current_plan` varchar(100) DEFAULT NULL,
  `plan_status` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_type` int(11) NOT NULL DEFAULT 1,
  `image` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `facility_name`, `email`, `phone`, `email_verified_at`, `password`, `remember_token`, `address_street`, `address_postcode`, `address_city`, `country`, `stripe_customer_id`, `current_period_end`, `current_plan`, `plan_status`, `created_at`, `updated_at`, `user_type`, `image`) VALUES
(20,	'admin',	NULL,	'nikita.agarwal@cnel.in',	NULL,	NULL,	'$2y$10$dl9eR9GyGDfUGJtGtx4rqeGrHHZrD444hHSuza1lD9teAzQoPHGYq',	NULL,	NULL,	NULL,	NULL,	NULL,	'cus_Th3dgROSpainJQ',	'2026-01-08',	'Enterprise',	'active',	'2025-12-03 06:00:22',	'2026-01-08 06:02:41',	2,	''),
(48,	'subscriber',	'nikita',	'sub@gmail.com',	789456123,	NULL,	'$2y$10$S65taE4125gE1EYSv4rTbucrT7nSIY8vso9LBbQ4ckJiLMsSU9ce.',	NULL,	'prtap nagar',	'302020',	'jaipur',	'india',	'cus_ThM8j6zXCyvemw',	NULL,	'Basic',	'active',	'2025-12-28 13:03:20',	'2025-12-31 08:27:35',	1,	''),
(54,	'Teena',	'Teenajain',	'teena@gmail.com',	1234567890,	NULL,	'$2y$10$gnhqJzfSRoJS0M1CwY5fUu1oWWk08DBEb6WnPzUZDs1YdHEpnjsPm',	NULL,	'jawaharnagae',	'302021',	'jaisalmer',	'india',	NULL,	'2026-01-16 08:05:24',	'Free',	'trialing',	'2026-01-02 08:05:24',	'2026-01-15 06:51:32',	1,	'profile-images/dxXJiIyVi6WAvk0RhcIuwtl4ljzUdRvhhZal6zJx.png'),
(55,	'Rahul',	'Nikita',	'rahulgupta@gmail.com',	1234567890,	NULL,	'$2y$10$qAKQqYDSP8j.NlpjivOMx.Kxo5sXr0aSKP6MIMInYXXTOp6UUEc5K',	NULL,	'Manarovar',	'302012',	'jaipur',	'india',	'cus_TiUQbd5SV1uEnw',	NULL,	'Pro',	'active',	'2026-01-02 08:10:32',	'2026-01-02 08:11:38',	1,	''),
(56,	'Vishnu',	'Vikas',	'vishnu@gmail.com',	1234567890,	NULL,	'$2y$10$VgTVwtnumt0JYk.5F7sRu.AoAj9sx.bwfAFJuMTLvZKomWNF7WT0O',	NULL,	'Jalmahal',	'30215',	'jaipur',	'india',	'cus_TiUVFRs18TKKLx',	NULL,	'Enterprise',	'active',	'2026-01-02 08:15:43',	'2026-01-15 06:54:50',	1,	'profile-images/kIjA6cLiuJT8ONl18Kc0Qb9eMUITDGkv6VrMb9nb.jpg');

-- 2026-01-15 07:44:36 UTC
