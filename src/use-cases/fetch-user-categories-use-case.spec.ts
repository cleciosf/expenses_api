import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository"
import { FetchUserCategoriesUseCase } from "./fetch-user-categories-use-case"

let categoryRepository: InMemoryCategoryRepository
let sut: FetchUserCategoriesUseCase

describe("Fetch User Categories Use Case", () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new FetchUserCategoriesUseCase(categoryRepository)
  })

  it("should fetch only active categories owned by the user", async () => {
    await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    const deletedCategory = await categoryRepository.create({
      name: "Casa",
      ownerId: "user-1"
    })

    await categoryRepository.create({
      name: "Viagem",
      ownerId: "user-2"
    })

    await categoryRepository.delete(deletedCategory.id, "user-1")

    const { categories } = await sut.execute({
      ownerId: "user-1"
    })

    expect(categories).toHaveLength(1)
    expect(categories[0]).toMatchObject({
      name: "Mercado",
      ownerId: "user-1",
      deletedAt: null
    })
  })
})
