import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { FetchUserCategoriesUseCase } from "../fetch-user-categories-use-case"

export function makeFetchUserCategoriesUseCase() {
  const prismaCategoryRepository = new PrismaCategoryRepository()
  const fetchUserCategoriesUseCase = new FetchUserCategoriesUseCase(
    prismaCategoryRepository
  )

  return fetchUserCategoriesUseCase
}
