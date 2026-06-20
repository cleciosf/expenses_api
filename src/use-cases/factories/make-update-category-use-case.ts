import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { UpdateCategoryUseCase } from "../update-category-use-case"

export function makeUpdateCategoryUseCase() {
  const prismaCategoryRepository = new PrismaCategoryRepository()
  const updateCategoryUseCase = new UpdateCategoryUseCase(prismaCategoryRepository)

  return updateCategoryUseCase
}
