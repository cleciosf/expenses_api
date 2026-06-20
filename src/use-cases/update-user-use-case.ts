import type { UsersRepository } from "@/repositories/users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import type { User } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { normalizeEmail } from "@/utils/normalize-email"

interface UpdateUseCaseRequest {
  userId: string
  name?: string
  email?: string
}

interface UpdateUseCaseResponse {
  user: User
}

export class UpdateUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
    name,
    email
  }: UpdateUseCaseRequest): Promise<UpdateUseCaseResponse> {
    const updateData: Prisma.UserUpdateInput = {}

    if (name !== undefined) updateData.name = name

    if (email !== undefined) {
      const normalizedEmail = normalizeEmail(email)
      const userWithSameEmail = await this.usersRepository.findByEmail(normalizedEmail)

      if (userWithSameEmail && userWithSameEmail.id !== userId) {
        throw new UserAlreadyExistsError()
      }
      updateData.email = normalizedEmail
    }

    const user = await this.usersRepository.update(userId, updateData)

    return {
      user,
    }
  }
}
