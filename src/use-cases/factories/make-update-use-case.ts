import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { UpdateUseCase } from "../update-user-use-case"

export function makeUpdateUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const updateUseCase = new UpdateUseCase(prismaUserRepository)

  return updateUseCase
}