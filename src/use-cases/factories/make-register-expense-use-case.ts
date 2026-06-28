import { PrismaCategoryRepository } from "@/repositories/prisma/prisma-categories-repository";
import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expenses-repository";
import { RegisterExpenseUseCase } from "../register-expense-use-case";

export function makeRegisterExpenseUseCase() {
  const prismaRegisterExpenseRepository = new PrismaExpenseRepository()
  const prismaCategoryRepository = new PrismaCategoryRepository()
  const registerExpenseUseCase = new RegisterExpenseUseCase(
    prismaRegisterExpenseRepository,
    prismaCategoryRepository
  )

  return registerExpenseUseCase
}
