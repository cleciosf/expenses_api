import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { Category } from "@prisma/client"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface GetCategoryDetailsUseCaseRequest {
  categoryId: string
  ownerId: string
}

interface GetCategoryDetailsUseCaseResponse {
  category: Category
}

export class GetCategoryDetailsUseCase {
  constructor(private categoryRepository: CategoriesRepository) {}

  async execute({
    categoryId,
    ownerId
  }: GetCategoryDetailsUseCaseRequest): Promise<GetCategoryDetailsUseCaseResponse> {
    const category = await this.categoryRepository.findByIdAndOwnerId(categoryId, ownerId)

    if (!category) {
      throw new ResourceNotFoundError()
    }

    return {
      category
    }
  }
}
