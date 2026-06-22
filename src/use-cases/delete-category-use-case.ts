import type { CategoriesRepository } from "@/repositories/categories-repository";
import type { Category } from "@prisma/client";

interface DeleteCategoryUseCaseRequest {
  categoryId: string
  ownerId: string
}

interface DeleteCategoryUseCaseResponse {
  category: Category
}

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoriesRepository) { }

  async execute({
    categoryId,
    ownerId,
  }: DeleteCategoryUseCaseRequest): Promise<DeleteCategoryUseCaseResponse> {
    const category = await this.categoryRepository.delete(categoryId, ownerId)

    return { category }
  }
}
