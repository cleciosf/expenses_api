import type { User, Prisma } from "@prisma/client";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>
  changePassword(id: string, passwordHash: string): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}