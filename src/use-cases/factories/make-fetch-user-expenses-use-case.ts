import { PrismaExpenseRepository } from "@/repositories/prisma/prisma-expenses-repository"
import { FetchUserExpensesUseCase } from "../fetch-user-expenses-use-case"

export function makeFetchUserExpensesUseCase() {
  const prismaExpenseRepository = new PrismaExpenseRepository()
  const fetchUserExpensesUseCase = new FetchUserExpensesUseCase(prismaExpenseRepository)

  return fetchUserExpensesUseCase
}
