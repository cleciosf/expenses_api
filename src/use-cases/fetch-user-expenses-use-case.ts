import type { Expense, PaymentMethodType } from "@prisma/client"
import type { ExpensesRepository } from "@/repositories/expenses-repository"

interface FetchUserExpensesUseCaseRequest {
  userId: string
  categoryId?: string | null
  startDate?: Date
  endDate?: Date
  minAmount?: number
  maxAmount?: number
  paymentMethod?: PaymentMethodType
}

interface FetchUserExpensesUseCaseResponse {
  expenses: Expense[]
}

export class FetchUserExpensesUseCase {
  constructor(private expensesRepository: ExpensesRepository) { }

  async execute({
    userId,
    categoryId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    paymentMethod
  }: FetchUserExpensesUseCaseRequest): Promise<FetchUserExpensesUseCaseResponse> {
    const expenses = await this.expensesRepository.findManyByUserId(userId, {
      categoryId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      paymentMethod
    })

    return { expenses }
  }
}
