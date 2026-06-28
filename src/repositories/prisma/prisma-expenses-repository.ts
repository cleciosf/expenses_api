import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import type { ExpensesRepository } from "../expenses-repository"
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error"
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"


function throwIfKnownPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    throw new ResourceNotFoundError()
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    throw new UserAlreadyExistsError()
  }

  throw error
}
export class PrismaExpenseRepository implements ExpensesRepository {
  async create(data: Prisma.ExpenseUncheckedCreateInput) {
    try {
      const expense = await prisma.expense.create({
        data
      })

      return expense
    } catch (error) {
      throwIfKnownPrismaError(error)
    }
  }
}