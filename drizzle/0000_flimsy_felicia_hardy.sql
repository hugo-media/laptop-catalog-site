CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "accessories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"brand" varchar(100) NOT NULL,
	"compatibility" varchar(255) NOT NULL,
	"color" varchar(100) NOT NULL,
	"condition" varchar(50) NOT NULL,
	"warranty" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"discountPercent" integer DEFAULT 0 NOT NULL,
	"imageUrl" text,
	"description" text,
	"categories" text DEFAULT '["new"]' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "laptops" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"processor" varchar(255) NOT NULL,
	"graphicsCard" varchar(255) NOT NULL,
	"ram" varchar(100) NOT NULL,
	"storage" varchar(100) NOT NULL,
	"display" varchar(100) NOT NULL,
	"operatingSystem" varchar(100) NOT NULL,
	"condition" varchar(50) NOT NULL,
	"warranty" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"discountPercent" integer DEFAULT 0 NOT NULL,
	"imageUrl" text,
	"description" text,
	"categories" text DEFAULT '["new"]' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monitors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"resolution" varchar(100) NOT NULL,
	"panelType" varchar(100) NOT NULL,
	"refreshRate" varchar(100) NOT NULL,
	"brightness" varchar(100) NOT NULL,
	"contrast" varchar(100) NOT NULL,
	"responseTime" varchar(100) NOT NULL,
	"connectivity" varchar(255) NOT NULL,
	"size" varchar(50) NOT NULL,
	"condition" varchar(50) NOT NULL,
	"warranty" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"discountPercent" integer DEFAULT 0 NOT NULL,
	"imageUrl" text,
	"description" text,
	"categories" text DEFAULT '["new"]' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_type" varchar(50) NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" integer,
	"rating" integer NOT NULL,
	"review" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smartDevices" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"brand" varchar(100) NOT NULL,
	"connectivity" varchar(255) NOT NULL,
	"battery" varchar(100) NOT NULL,
	"features" varchar(255) NOT NULL,
	"compatibility" varchar(255) NOT NULL,
	"condition" varchar(50) NOT NULL,
	"warranty" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"discountPercent" integer DEFAULT 0 NOT NULL,
	"imageUrl" text,
	"description" text,
	"categories" text DEFAULT '["new"]' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tablets" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"processor" varchar(255) NOT NULL,
	"ram" varchar(100) NOT NULL,
	"storage" varchar(100) NOT NULL,
	"display" varchar(100) NOT NULL,
	"operatingSystem" varchar(100) NOT NULL,
	"battery" varchar(100) NOT NULL,
	"camera" varchar(100) NOT NULL,
	"condition" varchar(50) NOT NULL,
	"warranty" varchar(100) NOT NULL,
	"price" integer NOT NULL,
	"discountPercent" integer DEFAULT 0 NOT NULL,
	"imageUrl" text,
	"description" text,
	"categories" text DEFAULT '["new"]' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"session_id" varchar(255),
	"product_type" varchar(50) NOT NULL,
	"product_id" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
