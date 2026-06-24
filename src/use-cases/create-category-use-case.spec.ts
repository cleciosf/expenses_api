import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryCategoryRepository } from "@/repositories/in-memory/in-memory-category-repository"
import { CreateCategoryUseCase } from "./create-category-use-case"
import { CategoryAlreadyExistsError } from "./errors/category-already-exists"

let categoryRepository: InMemoryCategoryRepository
let sut: CreateCategoryUseCase

describe("Create Category Use Case", () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new CreateCategoryUseCase(categoryRepository)
  })

  it("should be able to create a category", async () => {
    const { category } = await sut.execute({
      name: "Mercado",
      ownerId: "user-1"
    })

    expect(category.id).toEqual(expect.any(String))
    expect(category.ownerId).toEqual("user-1")
  })

  it("should trim the category name before creating it", async () => {
    const { category } = await sut.execute({
      name: "  Mercado  ",
      ownerId: "user-1"
    })

    expect(category.name).toEqual("Mercado")
  })

  it("should not create a duplicated category for the same owner", async () => {
    await sut.execute({
      name: "Mercado",
      ownerId: "user-1"
    })

    await expect(() =>
      sut.execute({
        name: "Mercado",
        ownerId: "user-1"
      })
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it("should not create a duplicated category with different casing for the same owner", async () => {
    await sut.execute({
      name: "Mercado",
      ownerId: "user-1"
    })

    await expect(() =>
      sut.execute({
        name: "mercado",
        ownerId: "user-1"
      })
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it("should not create a duplicated category with surrounding whitespace for the same owner", async () => {
    await sut.execute({
      name: "Mercado",
      ownerId: "user-1"
    })

    await expect(() =>
      sut.execute({
        name: "  Mercado  ",
        ownerId: "user-1"
      })
    ).rejects.toBeInstanceOf(CategoryAlreadyExistsError)
  })

  it("should allow the same category name for different owners", async () => {
    await sut.execute({
      name: "Mercado",
      ownerId: "user-1"
    })

    const { category } = await sut.execute({
      name: "Mercado",
      ownerId: "user-2"
    })

    expect(category.ownerId).toEqual("user-2")
  })

  it("should be able to create with a name from a deleted category", async () => {
    const { category: deletedCategory } = await sut.execute({
      name: "Mercado",
      ownerId: "user-1"
    })

    await categoryRepository.delete(deletedCategory.id, "user-1")

    const { category } = await sut.execute({
      name: "mercado",
      ownerId: "user-1"
    })

    expect(category.id).not.toEqual(deletedCategory.id)
  })
})
