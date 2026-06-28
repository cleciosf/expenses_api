import type { CategoriesRepository } from "@/repositories/categories-repository";
import type { ExpensesRepository } from "@/repositories/expenses-repository";
import type { Expense } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface RegisterExpenseUseCaseRequest {
  userId: string
  categoryId?: string | null
  description: string
  amount: number,
  paymentMethod: 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'
  expenseDate: Date
}

interface RegisterExpenseUseCaseResponse {
  expense: Expense
}

export class RegisterExpenseUseCase {
  constructor(
    private expensesRepository: ExpensesRepository,
    private categoriesRepository: CategoriesRepository
  ) { }

  async execute({
    userId,
    categoryId,
    description,
    amount,
    paymentMethod,
    expenseDate
  }: RegisterExpenseUseCaseRequest): Promise<RegisterExpenseUseCaseResponse> {
    if (categoryId) {
      const category = await this.categoriesRepository.findByIdAndOwnerId(categoryId, userId)

      if (!category) {
        throw new ResourceNotFoundError()
      }
    }

    const expense = await this.expensesRepository.create({
      userId,
      categoryId,
      description,
      amount,
      paymentMethod,
      expenseDate
    })

    return { expense }
  }
}
