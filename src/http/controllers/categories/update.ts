import { z } from "zod"
import { type FastifyRequest, type FastifyReply } from "fastify"
import { makeUpdateCategoryUseCase } from "@/use-cases/factories/make-update-category-use-case"
import { CategoryAlreadyExistsError } from "@/use-cases/errors/category-already-exists"

const updateParamsSchema = z.object({
  categoryId: z.string().uuid()
})

const updateBodySchema = z.object({
  name: z.string().trim().min(1)
})

export async function updateCategory(request: FastifyRequest, reply: FastifyReply) {
  const { categoryId } = updateParamsSchema.parse(request.params)
  const { name } = updateBodySchema.parse(request.body)

  try {
    const updateCategoryUseCase = makeUpdateCategoryUseCase()

    await updateCategoryUseCase.execute({
      categoryId,
      name,
      ownerId: request.user.sub
    })

    return reply.status(204).send()
  } catch (err) {
    if (err instanceof CategoryAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
}
