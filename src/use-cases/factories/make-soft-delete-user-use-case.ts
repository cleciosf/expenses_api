import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { SoftDeleteUseCase } from "../soft-delete-user-use-case"

export function makeSoftDeleteUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const softDeleteUseCase = new SoftDeleteUseCase(prismaUserRepository)

  return softDeleteUseCase
}

