import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { UsersRepository } from '../users-repository'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

function throwIfKnownPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    throw new ResourceNotFoundError()
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new UserAlreadyExistsError()
  }

  throw error
}

export class PrismaUserRepository implements UsersRepository {
  async findById(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      }
    })

    return user
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
        deletedAt: null,
      }
    })

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      const user = await prisma.user.create({
        data
      })

      return user
    } catch (error) {
      throwIfKnownPrismaError(error)
    }
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      const user = await prisma.user.update({
        where: {
          id,
          deletedAt: null,
        },
        data,
      })

      return user
    } catch (error) {
      throwIfKnownPrismaError(error)
    }
  }

  async changePassword(id: string, passwordHash: string) {
    try {
      const user = await prisma.user.update({
        where: {
          id,
          deletedAt: null,
        },
        data: { passwordHash },
      })

      return user
    } catch (error) {
      throwIfKnownPrismaError(error)
    }
  }

  async softDelete(id: string) {
    try {
      const user = await prisma.user.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date()
        },
      })

      return user
    } catch (error) {
      throwIfKnownPrismaError(error)
    }
  }
}
