import type { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '@/env'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'

const usersRepository = new PrismaUserRepository()

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  if (request.user.type !== 'refresh') {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  const user = await usersRepository.findById(request.user.sub)

  if (!user) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  const token = await reply.jwtSign(
    {
      sub: request.user.sub,
      type: 'access'
    },
    {
      sign: { expiresIn: '15m' }
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      sub: request.user.sub,
      type: 'refresh'
    },
    {
      sign: { expiresIn: '7d' }
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: env.NODE_ENV === 'production',
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
