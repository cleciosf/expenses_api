import type { FastifyRequest, FastifyReply } from "fastify"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository"

const usersRepository = new PrismaUserRepository()

export async function jwtVerify(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  if (request.user.type !== 'access') {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  const user = await usersRepository.findById(request.user.sub)

  if (!user) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
