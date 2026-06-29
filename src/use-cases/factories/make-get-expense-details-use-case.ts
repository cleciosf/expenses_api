import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expenses-repository"
import { GetExpenseDetailsUseCase } from "../get-expense-details-use-case"

export function makeGetExpenseDetailsUseCase() {
  const prismaExpensesRepository = new PrismaExpenseRepository()
  const getExpenseDetailUseCase = new GetExpenseDetailsUseCase(prismaExpensesRepository)

  return getExpenseDetailUseCase
}