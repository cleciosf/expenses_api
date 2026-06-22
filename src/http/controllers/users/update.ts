import { z } from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeUpdateUseCase } from '@/use-cases/factories/make-update-use-case'

const updateBodySchema = z.object({
  name: z.string(),
  email: z.string().trim().toLowerCase().email()
})

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const { name, email } = updateBodySchema.parse(request.body)

  try {
    await makeUpdateUseCase().execute({ userId: request.user.sub, name, email })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }

  return reply.status(200).send(
    {
      message: 'Usuário editado com sucesso',
      user: {
        name,
        email,
      }
    })
}
