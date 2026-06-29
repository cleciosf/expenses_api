import type { Expense } from "@prisma/client"
import { Prisma } from "@prisma/client"
import type { ExpensesRepository } from "../expenses-repository"
import { randomUUID } from "node:crypto"

export class InMemoryExpenseRepository implements ExpensesRepository {
  public items: Expense[] = []

  async create(data: Prisma.ExpenseUncheckedCreateInput) {
    const expense = {
      id: randomUUID(),
      userId: data.userId,
      categoryId: data.categoryId ?? null,
      description: data.description,
      amount: new Prisma.Decimal(data.amount as string | number | Prisma.Decimal),
      paymentMethod: data.paymentMethod,
      expenseDate: new Date(data.expenseDate),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    this.items.push(expense)

    return expense
  }

  async findByIdAndUserId(id: string, userId: string) {
    const expense = this.items.find(
      (item) => item.id === id && item.userId === userId && item.deletedAt === null
    )

    return expense || null
  }
}
