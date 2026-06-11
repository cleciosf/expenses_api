import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";
import { ChangePasswordUseCase } from "../change-password-use-case";

export function makeChagePasswordUseCase() {
  const prismaUserRepository = new PrismaUserRepository()
  const changePasswordUseCase = new ChangePasswordUseCase(prismaUserRepository)

  return changePasswordUseCase
}