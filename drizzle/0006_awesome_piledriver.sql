CREATE TABLE `accessories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`brand` varchar(100) NOT NULL,
	`compatibility` varchar(255) NOT NULL,
	`color` varchar(100) NOT NULL,
	`condition` varchar(50) NOT NULL,
	`warranty` varchar(100) NOT NULL,
	`price` int NOT NULL,
	`imageUrl` text,
	`description` text,
	`category` enum('promotions','refurbished','new','business') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accessories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `smartDevices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`brand` varchar(100) NOT NULL,
	`connectivity` varchar(255) NOT NULL,
	`battery` varchar(100) NOT NULL,
	`features` varchar(255) NOT NULL,
	`compatibility` varchar(255) NOT NULL,
	`condition` varchar(50) NOT NULL,
	`warranty` varchar(100) NOT NULL,
	`price` int NOT NULL,
	`imageUrl` text,
	`description` text,
	`category` enum('promotions','refurbished','new','business') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `smartDevices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tablets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`processor` varchar(255) NOT NULL,
	`ram` varchar(100) NOT NULL,
	`storage` varchar(100) NOT NULL,
	`display` varchar(100) NOT NULL,
	`operatingSystem` varchar(100) NOT NULL,
	`battery` varchar(100) NOT NULL,
	`camera` varchar(100) NOT NULL,
	`condition` varchar(50) NOT NULL,
	`warranty` varchar(100) NOT NULL,
	`price` int NOT NULL,
	`imageUrl` text,
	`description` text,
	`category` enum('promotions','refurbished','new','business') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tablets_id` PRIMARY KEY(`id`)
);
