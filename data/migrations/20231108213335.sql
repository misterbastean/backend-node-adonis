-- Disable the enforcement of foreign-keys constraints
PRAGMA foreign_keys = off;
-- Create "new_account" table
CREATE TABLE `new_account` (`id` text NOT NULL, `user_id` text NOT NULL, `category_id` text NOT NULL, `name` text NOT NULL, `amount` real NOT NULL, `available_amount` real NOT NULL, `account_number` text NOT NULL, `routing_number` integer NOT NULL, `currency_code` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`), CONSTRAINT `account_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE, CONSTRAINT `account_category_fk` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE);
-- Copy rows from old table "account" to new temporary table "new_account"
INSERT INTO `new_account` (`id`, `user_id`, `name`, `amount`, `available_amount`, `account_number`, `routing_number`, `currency_code`, `created_at`, `updated_at`, `deleted_at`) SELECT `id`, `user_id`, `name`, `amount`, `available_amount`, `account_number`, `routing_number`, `currency_code`, `created_at`, `updated_at`, `deleted_at` FROM `account`;
-- Drop "account" table after copying rows
DROP TABLE `account`;
-- Rename temporary table "new_account" to "account"
ALTER TABLE `new_account` RENAME TO `account`;
-- Create index "account_number_idx" to table: "account"
CREATE UNIQUE INDEX `account_number_idx` ON `account` (`account_number`);
-- Create index "account_routing_number_idx" to table: "account"
CREATE INDEX `account_routing_number_idx` ON `account` (`routing_number`);
-- Create index "account_created_at_idx" to table: "account"
CREATE INDEX `account_created_at_idx` ON `account` (`created_at`);
-- Create index "account_updated_at_idx" to table: "account"
CREATE INDEX `account_updated_at_idx` ON `account` (`updated_at`);
-- Create index "account_deleted_at_idx" to table: "account"
CREATE INDEX `account_deleted_at_idx` ON `account` (`deleted_at`);
-- Create "new_transaction" table
CREATE TABLE `new_transaction` (`id` text NOT NULL, `user_id` text NOT NULL, `account_id` text NOT NULL, `category_id` text NOT NULL, `amount` real NOT NULL, `status` text NOT NULL, `merchant_name` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`), CONSTRAINT `transaction_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE, CONSTRAINT `transaction_account_fk` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE, CONSTRAINT `transaction_category_fk` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE);
-- Copy rows from old table "transaction" to new temporary table "new_transaction"
INSERT INTO `new_transaction` (`id`, `user_id`, `account_id`, `amount`, `status`, `merchant_name`, `created_at`, `updated_at`, `deleted_at`) SELECT `id`, `user_id`, `account_id`, `amount`, `status`, `merchant_name`, `created_at`, `updated_at`, `deleted_at` FROM `transaction`;
-- Drop "transaction" table after copying rows
DROP TABLE `transaction`;
-- Rename temporary table "new_transaction" to "transaction"
ALTER TABLE `new_transaction` RENAME TO `transaction`;
-- Create index "transaction_status_idx" to table: "transaction"
CREATE INDEX `transaction_status_idx` ON `transaction` (`status`);
-- Create index "transaction_merchant_name_idx" to table: "transaction"
CREATE INDEX `transaction_merchant_name_idx` ON `transaction` (`merchant_name`);
-- Create index "transaction_created_at_idx" to table: "transaction"
CREATE INDEX `transaction_created_at_idx` ON `transaction` (`created_at`);
-- Create index "transaction_updated_at_idx" to table: "transaction"
CREATE INDEX `transaction_updated_at_idx` ON `transaction` (`updated_at`);
-- Create index "transaction_deleted_at_idx" to table: "transaction"
CREATE INDEX `transaction_deleted_at_idx` ON `transaction` (`deleted_at`);
-- Create "category" table
CREATE TABLE `category` (`id` text NOT NULL, `name` text NOT NULL, `type` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`));
-- Create index "category_name_idx" to table: "category"
CREATE INDEX `category_name_idx` ON `category` (`name`);
-- Create index "category_type_idx" to table: "category"
CREATE INDEX `category_type_idx` ON `category` (`type`);
-- Create index "category_created_at_idx" to table: "category"
CREATE INDEX `category_created_at_idx` ON `category` (`created_at`);
-- Create index "category_updated_at_idx" to table: "category"
CREATE INDEX `category_updated_at_idx` ON `category` (`updated_at`);
-- Create index "category_deleted_at_idx" to table: "category"
CREATE INDEX `category_deleted_at_idx` ON `category` (`deleted_at`);
-- Enable back the enforcement of foreign-keys constraints
PRAGMA foreign_keys = on;
