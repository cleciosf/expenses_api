import type { FastifyRequest, FastifyReply } from "fastify"
import { makeFetchUserCategoriesUseCase } from "@/use-cases/factories/make-fetch-user-categories-use-case"

export async function fetchUserCategories(request: FastifyRequest, reply: FastifyReply) {
  const fetchUserCategoriesUseCase = makeFetchUserCategoriesUseCase()

  const { categories } = await fetchUserCategoriesUseCase.execute({
    ownerId: request.user.sub
  })

  return reply.status(200).send({ categories })
}
