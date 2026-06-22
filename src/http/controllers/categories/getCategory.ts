import { makeGetCategoryDetailsUseCase } from "@/use-cases/factories/make-get-category-details-use-case"
import type { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

const getCategoryDetailsParamsSchema = z.object({
  categoryId: z.string().uuid()
})

export async function getCategoryDetails(request: FastifyRequest, reply: FastifyReply) {
  const { categoryId } = getCategoryDetailsParamsSchema.parse(request.params)
  const ownerId = request.user.sub

  const { category } = await makeGetCategoryDetailsUseCase().execute({
    categoryId,
    ownerId
  })

  return reply.status(200).send({ category })
}
