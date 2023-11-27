-- Create "user" table
CREATE TABLE `user` (`id` text NOT NULL, `user_name` text NOT NULL, `first_name` text NOT NULL, `last_name` text NOT NULL, `email` text NOT NULL, `password` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`));
-- Create index "user_name_idx" to table: "user"
CREATE UNIQUE INDEX `user_name_idx` ON `user` (`user_name`);
-- Create index "user_email_idx" to table: "user"
CREATE UNIQUE INDEX `user_email_idx` ON `user` (`email`);
-- Create index "user_created_at_idx" to table: "user"
CREATE INDEX `user_created_at_idx` ON `user` (`created_at`);
-- Create index "user_updated_at_idx" to table: "user"
CREATE INDEX `user_updated_at_idx` ON `user` (`updated_at`);
-- Create index "user_deleted_at_idx" to table: "user"
CREATE INDEX `user_deleted_at_idx` ON `user` (`deleted_at`);
-- Create "account" table
CREATE TABLE `account` (`id` text NOT NULL, `user_id` text NOT NULL, `name` text NOT NULL, `preferred_name` text NOT NULL, `amount` real NOT NULL, `available_amount` real NOT NULL, `account_number` text NOT NULL, `routing_number` integer NOT NULL, `currency_code` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`), CONSTRAINT `user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE);
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
-- Create "transaction" table
CREATE TABLE `transaction` (`id` text NOT NULL, `user_id` text NOT NULL, `account_id` text NOT NULL, `amount` real NOT NULL, `status` text NOT NULL, `merchant_name` text NOT NULL, `created_at` datetime NOT NULL, `updated_at` datetime NOT NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`), CONSTRAINT `user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE, CONSTRAINT `account_fk` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE);
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
