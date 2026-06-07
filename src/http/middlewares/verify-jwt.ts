import type { FastifyRequest, FastifyReply } from "fastify";

export async function jwtVerify(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  if (request.user.type !== 'access') {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
