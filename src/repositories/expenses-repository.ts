import type { Expense, PaymentMethodType, Prisma } from "@prisma/client";

export interface FindManyExpensesFilters {
  categoryId?: string | null
  startDate?: Date
  endDate?: Date
  minAmount?: number
  maxAmount?: number
  paymentMethod?: PaymentMethodType
}

export interface ExpensesRepository {
  create(data: Prisma.ExpenseUncheckedCreateInput): Promise<Expense>
  findByIdAndUserId(id: string, userId: string): Promise<Expense | null>
  findManyByUserId(userId: string, filters?: FindManyExpensesFilters): Promise<Expense[]>
}