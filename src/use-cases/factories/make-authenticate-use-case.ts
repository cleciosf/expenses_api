import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateUseCase } from "../authenticate-use-case"

export function makeAuthenticateUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const authenticateUseCase = new AuthenticateUseCase(prismaUserRepository)

  return authenticateUseCase
}