import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client';
import type { UsersRepository } from '../users-repository'

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
    const user = await prisma.user.create({
      data
    })

    return user
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({
      where: { id },
      data,
    })

    return user
  }

  async changePassword(id: string, passwordHash: string) {
    const user = await prisma.user.update({
      where: { id },
      data: { passwordHash },
    })

    return user
  }
}
