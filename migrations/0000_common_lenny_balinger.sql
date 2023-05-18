CREATE TABLE `auth_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`primary_key` integer NOT NULL,
	`hashed_password` text,
	`expires` integer,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` integer NOT NULL,
	`idle_expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`description` text NOT NULL,
	`done` integer DEFAULT 0,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT 0 NOT NULL,
	`role` text DEFAULT ('default') NOT NULL
);
