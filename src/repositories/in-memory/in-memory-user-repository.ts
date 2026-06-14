import type { User, Prisma } from '@prisma/client';
import type { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error';

export class InMemoryUserRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id && item.deletedAt === null)

    return user || null
  }

  async findByEmail(email: string) {
    const normalizedEmail = email.toLowerCase()
    const user = this.items.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.deletedAt === null,
    )

    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    this.items.push(user)

    return user

  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const userIndex = this.items.findIndex((item) => item.id === id)

    if (userIndex === -1) {
      throw new ResourceNotFoundError()
    }

    const existingUser = this.items[userIndex]

    const updatedUser = {
      ...existingUser,
      name: (data.name as string) ?? existingUser.name,
      email: (data.email as string) ?? existingUser.email,
      updatedAt: new Date()
    }

    this.items[userIndex] = updatedUser

    return updatedUser
  }

  async changePassword(id: string, passwordHash: string) {
    const userIndex = this.items.findIndex((item) => item.id === id)

    if (userIndex === -1) {
      throw new ResourceNotFoundError()
    }

    const updatedUser = this.items[userIndex]

    const changePassword = {
      ...updatedUser,
      passwordHash,
      updatedAt: new Date()
    }

    this.items[userIndex] = changePassword

    return updatedUser
  }

  async softDelete(id: string) {
    const userIndex = this.items.findIndex((item) => item.id === id && item.deletedAt === null)

    if (userIndex === -1) {
      throw new ResourceNotFoundError()
    }

    const user = this.items[userIndex]

    const updatedUser = {
      ...user,
      deletedAt: new Date()
    }

    this.items[userIndex] = updatedUser

    return updatedUser
  }
}
