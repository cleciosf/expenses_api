import { z } from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { makeChangePasswordUseCase } from '@/use-cases/factories/make-change-password-use-case'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6)

})

export async function changePassword(request: FastifyRequest, reply: FastifyReply) {
  const { currentPassword, newPassword } = changePasswordBodySchema.parse(request.body)

  try {
    await makeChangePasswordUseCase().execute({ userId: request.user.sub, currentPassword, newPassword })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
  return reply.status(204).send()
}
