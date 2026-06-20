import type { CategoriesRepository } from "@/repositories/categories-repository"
import type { Category } from "@prisma/client"
import { CategoryAlreadyExistsError } from "./errors/category-already-exists"

interface CreateCategoryUseCaseRequest {
  name: string
  ownerId: string
}

interface CreateCategoryUseCaseResponse {
  category: Category
}

export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) { }

  async execute({
    name,
    ownerId
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const userWithSameCategory = await this.categoriesRepository.findByNameAndOwnerId(
      name,
      ownerId
    )

    if (userWithSameCategory) {
      throw new CategoryAlreadyExistsError()
    }

    const category = await this.categoriesRepository.create({
      name,
      ownerId
    })

    return { category }
  }
}
