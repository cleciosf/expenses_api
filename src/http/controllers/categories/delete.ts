import { makeDeleteCategoryUseCase } from "@/use-cases/factories/make-delete-category-use-case";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'


const deleteParamsSchema = z.object({
  categoryId: z.string().uuid()
})

export async function deleteCategory(request: FastifyRequest, reply: FastifyReply) {
  const { categoryId } = deleteParamsSchema.parse(request.params)

  const deleteCategoryUseCase = makeDeleteCategoryUseCase()

  await deleteCategoryUseCase.execute({
    categoryId,
    ownerId: request.user.sub
  })

  return reply.status(204).send()
}
