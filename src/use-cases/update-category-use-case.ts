import type { CategoriesRepository } from "@/repositories/categories-repository"
import { CategoryAlreadyExistsError } from "./errors/category-already-exists"
import type { Category } from "@prisma/client"
import type { Prisma } from "@prisma/client"

interface UpdateCategoryCaseRequest {
  categoryId: string
  ownerId: string
  name: string
}

interface UpdateCategoryUseCaseResponse {
  category: Category
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoriesRepository) { }

  async execute({
    categoryId,
    ownerId,
    name
  }: UpdateCategoryCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
    const categoryWithSameName = await this.categoryRepository.findByNameAndOwnerId(
      name,
      ownerId
    )

    if (categoryWithSameName && categoryWithSameName.id !== categoryId) {
      throw new CategoryAlreadyExistsError()
    }

    const updateData: Prisma.CategoryUpdateInput = {
      name
    }

    const category = await this.categoryRepository.update(
      categoryId,
      ownerId,
      updateData
    )

    return {
      category
    }
  }
}
