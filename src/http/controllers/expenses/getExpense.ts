import { makeGetExpenseDetailsUseCase } from "@/use-cases/factories/make-get-expense-details-use-case"
import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from 'zod'

const getExpenseDetailsParamsSchema = z.object({
  expenseId: z.string().uuid(),
})

export async function getExpenseDetails(request: FastifyRequest, reply: FastifyReply) {

  const { expenseId } = getExpenseDetailsParamsSchema.parse(request.params)
  const userId = request.user.sub

  const { expense } = await makeGetExpenseDetailsUseCase().execute({
    expenseId,
    userId
  })

  return reply.status(200).send({ expense })
}

