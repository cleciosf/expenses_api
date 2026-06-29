import type { Expense } from "@prisma/client"
import type { ExpensesRepository } from "@/repositories/expenses-repository"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface GetExpenseDetailsUseCaseRequest {
  expenseId: string
  userId: string
}

interface GetExpenseDetailsUseCaseResponse {
  expense: Expense
}

export class GetExpenseDetailsUseCase {
  constructor(private expenseRepository: ExpensesRepository) { }

  async execute({
    expenseId,
    userId,
  }: GetExpenseDetailsUseCaseRequest): Promise<GetExpenseDetailsUseCaseResponse> {
    const expense = await this.expenseRepository.findByIdAndUserId(expenseId, userId)

    if (!expense) {
      throw new ResourceNotFoundError()
    }

    return {
      expense
    }
  }
}
