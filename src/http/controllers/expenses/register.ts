import { z } from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeRegisterExpenseUseCase } from '@/use-cases/factories/make-register-expense-use-case'

const registerBodySchema = z.object({
  description: z.string().trim().min(1),
  amount: z.number().positive(),
  paymentMethod: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX"]),
  categoryId: z.string().uuid().nullish(),
  expenseDate: z.coerce.date(),
})

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { description, amount, paymentMethod, categoryId, expenseDate } = registerBodySchema.parse(request.body)
  const userId = request.user.sub


  await makeRegisterExpenseUseCase().execute({ userId, categoryId, description, amount, paymentMethod, expenseDate })

  return reply.status(201).send({
    message: "Despesa Cadastrada com sucesso"
  })
} 
