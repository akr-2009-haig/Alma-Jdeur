CREATE TABLE "registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"gender" text NOT NULL,
	"id_number" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"passport_status" text NOT NULL,
	"photo_url" text,
	"created_at" timestamp DEFAULT now()
);
