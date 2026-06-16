import { makeSoftDeleteUseCase } from "@/use-cases/factories/make-soft-delete-user-use-case"
import type { FastifyRequest, FastifyReply } from "fastify"

export async function softDelete(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user

  const softDeleteUseCase = makeSoftDeleteUseCase()

  await softDeleteUseCase.execute({ userId })

  return reply.status(200).send({ message: 'Usuário deletado com sucesso' })
}