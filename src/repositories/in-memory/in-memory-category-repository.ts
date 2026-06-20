import type { Category, Prisma } from "@prisma/client"
import type { CategoriesRepository } from "../categories-repository"
import { randomUUID } from "node:crypto"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

export class InMemoryCategoryRepository implements CategoriesRepository {
  public items: Category[] = []

  async findById(id: string) {
    const category = this.items.find((item) => item.id === id)

    return category || null
  }

  async findByNameAndOwnerId(name: string, ownerId: string) {
    const category = this.items.find(
      (item) => item.name === name && item.ownerId === ownerId
    )

    return category || null
  }

  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category = {
      id: randomUUID(),
      ownerId: data.ownerId,
      name: data.name,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.items.push(category)

    return category
  }

  async update(id: string, ownerId: string, data: Prisma.CategoryUpdateInput) {
    const categoryIndex = this.items.findIndex(
      (item) => item.id === id && item.ownerId === ownerId && item.isActive
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
}
