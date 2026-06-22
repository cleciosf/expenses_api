ALTER TABLE "categories" ADD COLUMN "deleted_at" TIMESTAMP(3);

CREATE INDEX "categories_deleted_at_idx" ON "categories"("deleted_at");

DROP INDEX IF EXISTS "categories_owner_id_name_case_insensitive_unique";

CREATE UNIQUE INDEX "categories_owner_id_name_case_insensitive_unique"
ON "categories" ("owner_id", LOWER("name"))
WHERE "deleted_at" IS NULL;
