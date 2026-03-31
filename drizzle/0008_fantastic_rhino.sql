CREATE TABLE `product_ratings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`product_type` varchar(50) NOT NULL,
	`product_id` int NOT NULL,
	`user_id` int,
	`rating` int NOT NULL,
	`review` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_ratings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wishlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`session_id` varchar(255),
	`product_type` varchar(50) NOT NULL,
	`product_id` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wishlist_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `accessories` ADD `categories` text DEFAULT ('["new"]') NOT NULL;--> statement-breakpoint
ALTER TABLE `laptops` ADD `categories` text DEFAULT ('["new"]') NOT NULL;--> statement-breakpoint
ALTER TABLE `monitors` ADD `categories` text DEFAULT ('["new"]') NOT NULL;--> statement-breakpoint
ALTER TABLE `smartDevices` ADD `categories` text DEFAULT ('["new"]') NOT NULL;--> statement-breakpoint
ALTER TABLE `tablets` ADD `categories` text DEFAULT ('["new"]') NOT NULL;--> statement-breakpoint
ALTER TABLE `accessories` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `laptops` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `monitors` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `smartDevices` DROP COLUMN `category`;--> statement-breakpoint
ALTER TABLE `tablets` DROP COLUMN `category`;