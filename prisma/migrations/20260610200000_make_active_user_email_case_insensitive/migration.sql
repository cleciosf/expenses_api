DROP INDEX IF EXISTS "users_email_active_unique";

UPDATE "users"
SET "email" = LOWER(TRIM("email"));

CREATE UNIQUE INDEX "users_email_active_unique"
ON "users" (LOWER("email"))
WHERE "deleted_at" IS NULL;
