import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository"
import { UpdateCategoryUseCase } from "./update-category-use-case"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { CategoryAlreadyExistsError } from "./errors/category-already-exists"

let categoryRepository: InMemoryCategoryRepository
let sut: UpdateCategoryUseCase

describe("Update Category Use Case", () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new UpdateCategoryUseCase(categoryRepository)
  })

  it("should be able to update an owned category", async () => {
    const category = await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    const { category: updatedCategory } = await sut.execute({
      categoryId: category.id,
      ownerId: "user-1",
      name: "Casa"
    })

    expect(updatedCategory.name).toEqual("Casa")
  })

  it("should trim the category name before updating it", async () => {
    const category = await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    const { category: updatedCategory } = await sut.execute({
      categoryId: category.id,
      ownerId: "user-1",
      name: "  Casa  "
    })

    expect(updatedCategory.name).toEqual("Casa")
  })

  it("should not update a category owned by another user", async () => {
    const category = await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    await expect(() =>
      sut.execute({
        categoryId: category.id,
        ownerId: "user-2",
        name: "Casa"
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(categoryRepository.findById(category.id)).resolves.toMatchObject({
      name: "Mercado"
    })
  })

  it("should not update a category to a duplicated name for the same owner", async () => {
    await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    const category = await categoryRepository.create({
      name: "Casa",
      ownerId: "user-1"
    })

    await expect(() =>
      sut.execute({
        categoryId: category.id,
        ownerId: "user-1",
        name: "Mercado"
      })
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it("should not update a category to a duplicated name with different casing for the same owner", async () => {
    await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    const category = await categoryRepository.create({
      name: "Casa",
      ownerId: "user-1"
    })

    await expect(() =>
      sut.execute({
        categoryId: category.id,
        ownerId: "user-1",
        name: "mercado"
      })
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it("should not update a category to a duplicated name with surrounding whitespace for the same owner", async () => {
    await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    const category = await categoryRepository.create({
      name: "Casa",
      ownerId: "user-1"
    })

    await expect(() =>
      sut.execute({
        categoryId: category.id,
        ownerId: "user-1",
        name: "  Mercado  "
      })
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it("should not update a deleted category", async () => {
    const category = await categoryRepository.create({
      name: "Mercado",
      ownerId: "user-1"
    })

    await categoryRepository.delete(category.id, "user-1")

    await expect(() =>
      sut.execute({
        categoryId: category.id,
        ownerId: "user-1",
        name: "Casa"
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
