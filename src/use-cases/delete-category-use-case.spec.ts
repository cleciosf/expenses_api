import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository"
import { DeleteCategoryUseCase } from "./delete-category-use-case"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

let categoryRepository: InMemoryCategoryRepository
let sut: DeleteCategoryUseCase

describe("Delete Category Use Case", () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new DeleteCategoryUseCase(categoryRepository)
  })

  it("should soft delete a category", async () => {
    const category = await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    const { category: deletedCategory } = await sut.execute({
      categoryId: category.id,
      ownerId: "user-1"
    })

    expect(deletedCategory.deletedAt).toEqual(expect.any(Date))
  })

  it("should hide a deleted category from active category queries", async () => {
    const category = await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    await sut.execute({
      categoryId: category.id,
      ownerId: "user-1"
    })

    await expect(categoryRepository.findById(category.id)).resolves.toBeNull()
    await expect(
      categoryRepository.findByNameAndOwnerId(category.name, category.ownerId)
    ).resolves.toBeNull()
  })

  it("should not soft delete an already deleted category", async () => {
    const category = await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    await sut.execute({
      categoryId: category.id,
      ownerId: "user-1"
    })

    await expect(() =>
      sut.execute({
        categoryId: category.id,
        ownerId: "user-1"
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
