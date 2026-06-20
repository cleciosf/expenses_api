import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository"
import { CreateCategoryUseCase } from "../create-category-use-case"

export function makeCreateCategoryUseCase() {
  const prismaCreateCategoryRepository = new PrismaCategoryRepository()
  const createCategoryUseCase = new CreateCategoryUseCase(prismaCreateCategoryRepository)

  return createCategoryUseCase
}
