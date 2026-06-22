import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository";
import { DeleteCategoryUseCase } from "../delete-category-use-case";

export function makeDeleteCategoryUseCase() {
  const prismaCategoryRepository = new PrismaCategoryRepository()
  const deleteCategoryUseCase = new DeleteCategoryUseCase(prismaCategoryRepository)

  return deleteCategoryUseCase
}