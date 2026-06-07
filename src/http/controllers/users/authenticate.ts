import { z } from 'zod'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { env } from '@/env'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = authenticateBodySchema.safeParse(request.body)

  if (!result.success) {
    return reply.status(400).send({ message: 'Validation error', issues: result.error.issues })
  }

  const { email, password } = result.data

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password
    })

    const token = await reply.jwtSign(
      {
        sub: user.id,
        type: 'access'
      },
      {
        sign: {
          expiresIn: '15m'
        }
      }
    )

    const refreshToken = await reply.jwtSign(
      {
        sub: user.id,
        type: 'refresh'
      },
      {
        sign: { expiresIn: '7d' }
      }
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: env.NODE_ENV === 'production',
        sameSite: true,
        httpOnly: true
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }
    throw err
  }
}
