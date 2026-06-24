import type { Category } from "@prisma/client"
import type { CategoriesRepository } from "@/repositories/categories-repository"

interface FetchUserCategoriesUseCaseRequest {
  ownerId: string
}

interface FetchUserCategoriesUseCaseResponse {
  categories: Category[]
}

export class FetchUserCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    ownerId,
  }: FetchUserCategoriesUseCaseRequest): Promise<FetchUserCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findManyByOwnerId(ownerId)

    return { categories }
  }
}
