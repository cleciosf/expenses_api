import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeFetchUserExpensesUseCase } from "@/use-cases/factories/make-fetch-user-expenses-use-case"

const fetchUserExpensesQuerySchema = z.object({
  categoryId: z.union([z.string().uuid(), z.literal("null")]).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  minAmount: z.coerce.number().positive().max(9999.99).optional(),
  maxAmount: z.coerce.number().positive().max(9999.99).optional(),
  paymentMethod: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX"]).optional()
})

export async function fetchUserExpenses(request: FastifyRequest, reply: FastifyReply) {
  const {
    categoryId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    paymentMethod
  } = fetchUserExpensesQuerySchema.parse(request.query)

  const { expenses } = await makeFetchUserExpensesUseCase().execute({
    userId: request.user.sub,
    categoryId: categoryId === "null" ? null : categoryId,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    paymentMethod
  })

  return reply.status(200).send({ expenses })
}
