import { z } from "zod"
import type { FastifyRequest, FastifyReply } from "fastify"
import { makeCreateCategoryUseCase } from "@/use-cases/factories/make-create-category-use-case"
import { CategoryAlreadyExistsError } from "@/use-cases/errors/category-already-exists"

const createCategoryBodySchema = z.object({
  name: z.string().trim().min(1)
})

export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
  const { name } = createCategoryBodySchema.parse(request.body)
  const ownerId = request.user.sub

  try {
    const { category } = await makeCreateCategoryUseCase().execute({ name, ownerId })

    return reply.status(201).send({
      message: "Categoria cadastrada com sucesso",
      category: { id: category.id, name, ownerId }
    })
  } catch (err) {
    if (err instanceof CategoryAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
    throw err
  }
}
