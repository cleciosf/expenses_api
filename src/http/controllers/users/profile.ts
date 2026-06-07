import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import type { FastifyRequest, FastifyReply } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = user

  return reply.status(200).send({
    user: userWithoutPassword
  })
}