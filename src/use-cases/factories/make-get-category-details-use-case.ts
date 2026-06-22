import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { GetCategoryDetailsUseCase } from "../get-category-details-use-case"

export function makeGetCategoryDetailsUseCase() {
  const prismaCategoriesRepository = new PrismaCategoryRepository()
  const getCategoryDetailsUseCase = new GetCategoryDetailsUseCase(
    prismaCategoriesRepository
  )

  return getCategoryDetailsUseCase
}
