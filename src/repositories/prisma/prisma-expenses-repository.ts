import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import type { ExpensesRepository, FindManyExpensesFilters } from "../expenses-repository"
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

  async findByIdAndUserId(id: string, userId: string) {
    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId,
        deletedAt: null
      }
    })

    return expense
  }

  async findManyByUserId(userId: string, filters: FindManyExpensesFilters = {}) {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        deletedAt: null,
        categoryId: filters.categoryId,
        paymentMethod: filters.paymentMethod,
        expenseDate: {
          gte: filters.startDate,
          lte: filters.endDate
        },
        amount: {
          gte: filters.minAmount,
          lte: filters.maxAmount
        }
      },
      orderBy: {
        expenseDate: "asc"
      }
    })

    return expenses
  }
}
