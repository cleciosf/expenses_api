import type { Expense, Prisma } from "@prisma/client";

export interface ExpensesRepository {
  create(data: Prisma.ExpenseUncheckedCreateInput): Promise<Expense>
  findByIdAndUserId(id: string, userId: string): Promise<Expense | null>
}