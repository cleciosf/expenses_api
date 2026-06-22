DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM (
      SELECT "owner_id", LOWER("name") AS normalized_name, COUNT(*) AS duplicate_count
      FROM "categories"
      GROUP BY "owner_id", LOWER("name")
      HAVING COUNT(*) > 1
    ) duplicated_categories
  ) THEN
    RAISE EXCEPTION 'Cannot create case-insensitive category unique index because duplicated category names already exist for the same owner.';
  END IF;
END $$;

DROP INDEX IF EXISTS "categories_owner_id_name_key";

CREATE UNIQUE INDEX "categories_owner_id_name_case_insensitive_unique"
ON "categories" ("owner_id", LOWER("name"));
