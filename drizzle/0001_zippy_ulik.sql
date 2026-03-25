CREATE TABLE `laptops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`processor` varchar(255) NOT NULL,
	`graphicsCard` varchar(255) NOT NULL,
	`ram` varchar(100) NOT NULL,
	`storage` varchar(100) NOT NULL,
	`display` varchar(100) NOT NULL,
	`operatingSystem` varchar(100) NOT NULL,
	`condition` varchar(50) NOT NULL,
	`warranty` varchar(100) NOT NULL,
	`price` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `laptops_id` PRIMARY KEY(`id`)
);
