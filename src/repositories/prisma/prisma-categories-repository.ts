import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { CategoriesRepository } from "../categories-repository"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"

function throwIfNotFound(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    throw new ResourceNotFoundError()
  }

  throw error
}

export class PrismaCategoryRepository implements CategoriesRepository {
  async create(data: Prisma.CategoryUncheckedCreateInput) {
    const category = await prisma.category.create({
      data
    })
    return category
  }

  async update(id: string, ownerId: string, data: Prisma.CategoryUpdateInput) {
    try {
      const category = await prisma.category.update({
        where: {
          id,
          ownerId,
          isActive: true
        },
        data
      })
      return category
    } catch (error) {
      throwIfNotFound(error)
    }
  }

  async findById(id: string) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        isActive: true
      }
    })
    return category
  }

  async findByNameAndOwnerId(name: string, ownerId: string) {
    const category = await prisma.category.findFirst({
      where: {
        name,
        ownerId
      }
    })
    return category
  }
}
