import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import type { CategoriesRepository } from "../categories-repository"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"
import { CategoryAlreadyExistsError } from "@/use-cases/errors/category-already-exists"

function throwIfKnownPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    throw new ResourceNotFoundError()
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new CategoryAlreadyExistsError()
  }

  throw error
}

export class PrismaCategoryRepository implements CategoriesRepository {
  async create(data: Prisma.CategoryUncheckedCreateInput) {
    try {
      const category = await prisma.category.create({
        data
      })
      return category
    } catch (error) {
      throwIfKnownPrismaError(error)
    }
  }

  async update(id: string, ownerId: string, data: Prisma.CategoryUpdateInput) {
    try {
      const category = await prisma.category.update({
        where: {
          id,
          ownerId,
          deletedAt: null
        },
        data
      })
      return category
    } catch (error) {
      throwIfKnownPrismaError(error)
    }
  }

  async findById(id: string) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        deletedAt: null
      }
    })
    return category
  }

  async findByNameAndOwnerId(name: string, ownerId: string) {
    const category = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive"
        },
        ownerId,
        deletedAt: null
      }
    })
    return category
  }

  async delete(id: string, ownerId: string) {
    try {
      const category = await prisma.category.update({
        where: {
          id,
          ownerId,
          deletedAt: null
        },
        data: {
          deletedAt: new Date()
        }
      })
      return category
    } catch (error) {
      throwIfKnownPrismaError(error)
    }
  }

  async findByIdAndOwnerId(id: string, ownerId: string) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        ownerId,
        deletedAt: null
      }
    })
    return category
  }
}
