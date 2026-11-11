-- ============================================================================
-- ICU EATS — Database Schema
-- Covers Phases 1–6 (registration, restaurants, menus, checkout, ordering,
-- restaurant dashboard/kitchen, rider/GPS/dispatch, admin/payments/commissions,
-- reviews/notifications/promotions/analytics, AI recommendations/smart dispatch)
-- Target: MySQL / MariaDB (XAMPP)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `ai_recommendations`;
DROP TABLE IF EXISTS `dispatch_logs`;
DROP TABLE IF EXISTS `rider_locations`;
DROP TABLE IF EXISTS `deliveries`;
DROP TABLE IF EXISTS `riders`;
DROP TABLE IF EXISTS `payouts`;
DROP TABLE IF EXISTS `commissions`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `promotion_usage`;
DROP TABLE IF EXISTS `promotions`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `order_status_history`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `menu_items`;
DROP TABLE IF EXISTS `menu_categories`;
DROP TABLE IF EXISTS `restaurants`;
DROP TABLE IF EXISTS `addresses`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `analytics_snapshots`;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------------------
-- Phase 1: Users & Registration
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('customer','restaurant','rider','super_admin') NOT NULL DEFAULT 'customer',
  `first_name` VARCHAR(100) DEFAULT NULL,
  `last_name` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `phone_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `status` ENUM('active','suspended','banned','pending_verification') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 1: Addresses
-- ----------------------------------------------------------------------------
CREATE TABLE `addresses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `label` VARCHAR(50) DEFAULT NULL COMMENT 'e.g. Home, Work',
  `street` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `country` VARCHAR(100) NOT NULL DEFAULT 'US',
  `latitude` DECIMAL(10, 7) DEFAULT NULL,
  `longitude` DECIMAL(10, 7) DEFAULT NULL,
  `is_default` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_addresses_user` (`user_id`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 1: Restaurants
-- ----------------------------------------------------------------------------
CREATE TABLE `restaurants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `owner_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `cuisine_type` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `street` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT NULL DEFAULT 'US',
  `latitude` DECIMAL(10, 7) DEFAULT NULL,
  `longitude` DECIMAL(10, 7) DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `logo_url` VARCHAR(500) DEFAULT NULL,
  `cover_url` VARCHAR(500) DEFAULT NULL,
  `delivery_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `min_order_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `estimated_delivery_min` INT UNSIGNED NOT NULL DEFAULT 30 COMMENT 'estimated delivery minutes',
  `estimated_delivery_max` INT UNSIGNED NOT NULL DEFAULT 45,
  `is_open` TINYINT(1) NOT NULL DEFAULT 1,
  `is_approved` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'super admin approval',
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  `review_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_restaurants_slug` (`slug`),
  KEY `idx_restaurants_owner` (`owner_id`),
  KEY `idx_restaurants_city` (`city`),
  KEY `idx_restaurants_is_open` (`is_open`),
  KEY `idx_restaurants_is_approved` (`is_approved`),
  CONSTRAINT `fk_restaurants_owner` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 1: Menu Categories & Items
-- ----------------------------------------------------------------------------
CREATE TABLE `menu_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `restaurant_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_menu_categories_restaurant` (`restaurant_id`),
  CONSTRAINT `fk_menu_categories_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `menu_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `restaurant_id` BIGINT UNSIGNED NOT NULL,
  `category_id` BIGINT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  `is_vegetarian` TINYINT(1) NOT NULL DEFAULT 0,
  `is_vegan` TINYINT(1) NOT NULL DEFAULT 0,
  `is_gluten_free` TINYINT(1) NOT NULL DEFAULT 0,
  `prep_time_min` INT UNSIGNED NOT NULL DEFAULT 10 COMMENT 'kitchen prep minutes',
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  `review_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_menu_items_restaurant` (`restaurant_id`),
  KEY `idx_menu_items_category` (`category_id`),
  KEY `idx_menu_items_available` (`is_available`),
  CONSTRAINT `fk_menu_items_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_menu_items_category` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 1: Cart (session / logged-in)
-- ----------------------------------------------------------------------------
CREATE TABLE `cart_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT NULL for guest carts keyed by session/cart_token,
  `cart_token` VARCHAR(64) NOT NULL COMMENT 'guest cart identifier',
  `menu_item_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `special_instructions` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cart_items` (`user_id`,`cart_token`,`menu_item_id`),
  KEY `idx_cart_items_user` (`user_id`),
  KEY `idx_cart_items_token` (`cart_token`),
  CONSTRAINT `fk_cart_items_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_items_menu_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 1: Orders & Order Items
-- ----------------------------------------------------------------------------
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_number` VARCHAR(32) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `restaurant_id` BIGINT UNSIGNED NOT NULL,
  `address_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled','refunded') NOT NULL DEFAULT 'pending',
  `payment_status` ENUM('unpaid','paid','failed','refunded','partially_refunded') NOT NULL DEFAULT 'unpaid',
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `delivery_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `tax` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `commission_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'platform commission',
  `rider_tip` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `special_instructions` TEXT DEFAULT NULL,
  `placed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` TIMESTAMP NULL DEFAULT NULL,
  `preparing_at` TIMESTAMP NULL DEFAULT NULL,
  `ready_at` TIMESTAMP NULL DEFAULT NULL,
  `out_for_delivery_at` TIMESTAMP NULL DEFAULT NULL,
  `delivered_at` TIMESTAMP NULL DEFAULT NULL,
  `cancelled_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_orders_order_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_restaurant` (`restaurant_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_placed_at` (`placed_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_orders_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `fk_orders_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `menu_item_id` BIGINT UNSIGNED NOT NULL,
  `name_snapshot` VARCHAR(200) NOT NULL COMMENT 'snapshot of item name at order time',
  `price_snapshot` DECIMAL(10, 2) NOT NULL,
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1,
  `special_instructions` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_menu_item` (`menu_item_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_menu_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 2: Order Status History (restaurant dashboard / kitchen)
-- ----------------------------------------------------------------------------
CREATE TABLE `order_status_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('pending','confirmed','preparing','ready','out_for_delivery','delivered','cancelled','refunded') NOT NULL,
  `changed_by` BIGINT UNSIGNED DEFAULT NULL COMMENT 'user who changed the status',
  `changed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `note` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_status_history_order` (`order_id`),
  KEY `idx_order_status_history_changed_at` (`changed_at`),
  CONSTRAINT `fk_order_status_history_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_status_history_changed_by` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 3: Riders
-- ----------------------------------------------------------------------------
CREATE TABLE `riders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `vehicle_type` ENUM('bike','scooter','car','bicycle','foot') NOT NULL DEFAULT 'bike',
  `vehicle_plate` VARCHAR(30) DEFAULT NULL,
  `license_number` VARCHAR(50) DEFAULT NULL,
  `is_online` TINYINT(1) NOT NULL DEFAULT 0,
  `is_available` TINYINT(1) NOT NULL DEFAULT 0,
  `current_latitude` DECIMAL(10, 7) DEFAULT NULL,
  `current_longitude` DECIMAL(10, 7) DEFAULT NULL,
  `last_location_update` TIMESTAMP NULL DEFAULT NULL,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  `delivery_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `total_earnings` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_riders_user` (`user_id`),
  KEY `idx_riders_online_available` (`is_online`,`is_available`),
  CONSTRAINT `fk_riders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 3: Deliveries & Dispatch
-- ----------------------------------------------------------------------------
CREATE TABLE `deliveries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `rider_id` BIGINT UNSIGNED DEFAULT NULL,
  `status` ENUM('assigned','picked_up','in_transit','delivered','failed','cancelled') NOT NULL DEFAULT 'assigned',
  `pickup_code` VARCHAR(10) DEFAULT NULL COMMENT 'code rider shows restaurant',
  `dropoff_code` VARCHAR(10) DEFAULT NULL COMMENT 'code customer confirms',
  `assigned_at` TIMESTAMP NULL DEFAULT NULL,
  `picked_up_at` TIMESTAMP NULL DEFAULT NULL,
  `delivered_at` TIMESTAMP NULL DEFAULT NULL,
  `estimated_delivery_at` TIMESTAMP NULL DEFAULT NULL,
  `actual_delivery_at` TIMESTAMP NULL DEFAULT NULL,
  `distance_meters` INT UNSIGNED DEFAULT NULL,
  `duration_seconds` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_deliveries_order` (`order_id`),
  KEY `idx_deliveries_rider` (`rider_id`),
  KEY `idx_deliveries_status` (`status`),
  CONSTRAINT `fk_deliveries_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_deliveries_rider` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `rider_locations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `rider_id` BIGINT UNSIGNED NOT NULL,
  `delivery_id` BIGINT UNSIGNED DEFAULT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `accuracy_meters` INT UNSIGNED DEFAULT NULL,
  `recorded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rider_locations_rider` (`rider_id`),
  KEY `idx_rider_locations_delivery` (`delivery_id`),
  KEY `idx_rider_locations_recorded_at` (`recorded_at`),
  CONSTRAINT `fk_rider_locations_rider` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rider_locations_delivery` FOREIGN KEY (`delivery_id`) REFERENCES `deliveries` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `dispatch_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `rider_id` BIGINT UNSIGNED DEFAULT NULL,
  `action` ENUM('assigned','reassigned','auto_assigned','declined','completed') NOT NULL,
  `reason` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_dispatch_logs_order` (`order_id`),
  KEY `idx_dispatch_logs_rider` (`rider_id`),
  CONSTRAINT `fk_dispatch_logs_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_dispatch_logs_rider` FOREIGN KEY (`rider_id`) REFERENCES `riders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 4: Payments, Commissions, Payouts
-- ----------------------------------------------------------------------------
CREATE TABLE `payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `provider` ENUM('stripe','paypal','razorpay','cash','wallet') NOT NULL DEFAULT 'stripe',
  `provider_payment_id` VARCHAR(255) DEFAULT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `status` ENUM('pending','succeeded','failed','refunded','partially_refunded') NOT NULL DEFAULT 'pending',
  `fee` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'payment processor fee',
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_payments_order` (`order_id`),
  KEY `idx_payments_provider_id` (`provider_payment_id`),
  KEY `idx_payments_status` (`status`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `commissions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `restaurant_id` BIGINT UNSIGNED NOT NULL,
  `percentage` DECIMAL(5, 2) NOT NULL COMMENT 'commission % applied',
  `amount` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('pending','paid','disputed','waived') NOT NULL DEFAULT 'pending',
  `calculated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_commissions_order` (`order_id`),
  KEY `idx_commissions_restaurant` (`restaurant_id`),
  KEY `idx_commissions_status` (`status`),
  CONSTRAINT `fk_commissions_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_commissions_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `payouts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `restaurant_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `method` ENUM('bank_transfer','wallet','check') NOT NULL DEFAULT 'bank_transfer',
  `reference` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending','processing','paid','failed','cancelled') NOT NULL DEFAULT 'pending',
  `period_start` DATE NOT NULL,
  `period_end` DATE NOT NULL,
  `paid_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payouts_restaurant` (`restaurant_id`),
  KEY `idx_payouts_status` (`status`),
  CONSTRAINT `fk_payouts_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 5: Reviews, Notifications, Promotions, Analytics
-- ----------------------------------------------------------------------------
CREATE TABLE `reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `restaurant_id` BIGINT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `title` VARCHAR(200) DEFAULT NULL,
  `comment` TEXT DEFAULT NULL,
  `is_anonymous` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reviews_order` (`order_id`),
  KEY `idx_reviews_restaurant` (`restaurant_id`),
  KEY `idx_reviews_user` (`user_id`),
  CONSTRAINT `fk_reviews_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_reviews_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('order_status','payment','promotion','system','delivery') NOT NULL DEFAULT 'system',
  `title` VARCHAR(200) NOT NULL,
  `body` TEXT DEFAULT NULL,
  `data` JSON DEFAULT NULL COMMENT 'extra payload (order_id, deep_link, etc.)',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `read_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notifications_user` (`user_id`),
  KEY `idx_notifications_unread` (`user_id`,`is_read`),
  KEY `idx_notifications_created_at` (`created_at`),
  CONSTRAINT `fk_notifications_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `promotions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `restaurant_id` BIGINT UNSIGNED DEFAULT NULL COMMENT NULL = platform-wide,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `type` ENUM('percent','fixed_amount','free_delivery','bogo') NOT NULL DEFAULT 'percent',
  `value` DECIMAL(12, 2) NOT NULL,
  `min_order_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `max_discount` DECIMAL(12, 2) DEFAULT NULL,
  `usage_limit` INT UNSIGNED DEFAULT NULL COMMENT NULL = unlimited,
  `usage_per_user` INT UNSIGNED NOT NULL DEFAULT 1,
  `starts_at` TIMESTAMP NOT NULL,
  `ends_at` TIMESTAMP NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_promotions_code` (`code`),
  KEY `idx_promotions_restaurant` (`restaurant_id`),
  KEY `idx_promotions_active` (`is_active`,`starts_at`,`ends_at`),
  CONSTRAINT `fk_promotions_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `promotion_usage` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `promotion_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `discount_amount` DECIMAL(12, 2) NOT NULL,
  `used_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_promotion_usage_promotion` (`promotion_id`),
  KEY `idx_promotion_usage_user` (`user_id`),
  CONSTRAINT `fk_promotion_usage_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotion_usage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotion_usage_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `analytics_snapshots` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `entity_type` ENUM('restaurant','platform','menu_item','rider') NOT NULL,
  `entity_id` BIGINT UNSIGNED DEFAULT NULL,
  `date` DATE NOT NULL,
  `orders_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `revenue` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `commission` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `avg_rating` DECIMAL(3, 2) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_analytics_snapshots` (`entity_type`,`entity_id`,`date`),
  KEY `idx_analytics_snapshots_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Phase 6: AI Recommendations & Smart Dispatch
-- ----------------------------------------------------------------------------
CREATE TABLE `ai_recommendations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `restaurant_id` BIGINT UNSIGNED DEFAULT NULL,
  `menu_item_id` BIGINT UNSIGNED DEFAULT NULL,
  `score` DECIMAL(5, 4) NOT NULL COMMENT 'recommendation confidence score',
  `reason` VARCHAR(255) DEFAULT NULL,
  `model_version` VARCHAR(50) DEFAULT NULL,
  `shown_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `clicked_at` TIMESTAMP NULL DEFAULT NULL,
  `ordered_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ai_recommendations_user` (`user_id`),
  KEY `idx_ai_recommendations_restaurant` (`restaurant_id`),
  KEY `idx_ai_recommendations_menu_item` (`menu_item_id`),
  CONSTRAINT `fk_ai_recommendations_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ai_recommendations_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ai_recommendations_menu_item` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- Super admin audit log (Phase 4)
-- ----------------------------------------------------------------------------
CREATE TABLE `admin_audit_log` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id` BIGINT UNSIGNED NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL,
  `entity_id` BIGINT UNSIGNED DEFAULT NULL,
  `old_values` JSON DEFAULT NULL,
  `new_values` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_audit_log_admin` (`admin_id`),
  KEY `idx_admin_audit_log_created_at` (`created_at`),
  CONSTRAINT `fk_admin_audit_log_admin` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- Indexes for common query patterns
-- ============================================================================
CREATE INDEX idx_orders_restaurant_status ON `orders` (`restaurant_id`, `status`);
CREATE INDEX idx_orders_user_status ON `orders` (`user_id`, `status`);
CREATE INDEX idx_deliveries_rider_status ON `deliveries` (`rider_id`, `status`);
CREATE INDEX idx_menu_items_restaurant_available ON `menu_items` (`restaurant_id`, `is_available`);

-- ============================================================================
-- Seed data (Phase 1 core) — optional, safe to run in dev
-- ============================================================================
-- INSERT INTO `users` (`email`,`password_hash`,`role`,`first_name`,`last_name`,`phone`,`status`)
-- VALUES
--   ('admin@icu-eats.test','$2y$10$...','super_admin','Super','Admin','+15550000000','active'),
--   ('owner@pasta.test','$2y$10$...','restaurant','Mario','Rossi','+15550000001','active'),
--   ('customer@test.test','$2y$10$...','customer','Jane','Doe','+15550000002','active');
--
-- INSERT INTO `restaurants` (`owner_id`,`name`,`slug`,`description`,`cuisine_type`,`delivery_fee`,`min_order_amount`,`is_open`,`is_approved`)
-- VALUES
--   (2,'Pasta Paradise','pasta-paradise','Authentic Italian pasta','Italian',2.99,15.00,1,1);
