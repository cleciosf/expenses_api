import type { Category, Prisma } from "@prisma/client"
import type { CategoriesRepository } from "../categories-repository"
import { randomUUID } from "node:crypto"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export class InMemoryCategoryRepository implements CategoriesRepository {
  public items: Category[] = []

  async findById(id: string) {
    const category = this.items.find((item) => item.id === id && item.deletedAt === null)

    return category || null
  }

  async findByNameAndOwnerId(name: string, ownerId: string) {
    const normalizedName = name.toLowerCase()
    const category = this.items.find(
      (item) =>
        item.name.toLowerCase() === normalizedName &&
        item.ownerId === ownerId &&
        item.deletedAt === null
    )

    return category || null
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category = {
      id: randomUUID(),
      ownerId: data.ownerId,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    this.items.push(category)

    return category
  }

  async update(id: string, ownerId: string, data: Prisma.CategoryUpdateInput) {
    const categoryIndex = this.items.findIndex(
      (item) => item.id === id && item.ownerId === ownerId && item.deletedAt === null
    )

    if (categoryIndex === -1) {
      throw new ResourceNotFoundError()
    }

    const existingCategory = this.items[categoryIndex]

    const updateCategory = {
      ...existingCategory,
      name: (data.name as string) ?? existingCategory.name,
      updatedAt: new Date()
    }

    this.items[categoryIndex] = updateCategory

    return updateCategory
  }

  async delete(id: string, ownerId: string) {
    const categoryIndex = this.items.findIndex(
      (item) => item.id === id && item.ownerId === ownerId && item.deletedAt === null
    )

    if (categoryIndex === -1) {
      throw new ResourceNotFoundError()
    }

    const category = this.items[categoryIndex]

    const deletedCategory = {
      ...category,
      deletedAt: new Date()
    }

    this.items[categoryIndex] = deletedCategory

    return deletedCategory
  }

  async findByIdAndOwnerId(id: string, ownerId: string) {
    const category = this.items.find(
      (item) => item.id === id && item.ownerId === ownerId && item.deletedAt === null
    )

    return category || null
  }

  async findManyByOwnerId(ownerId: string) {
    return this.items.filter(
      (item) => item.ownerId === ownerId && item.deletedAt === null
    )
  }
}
