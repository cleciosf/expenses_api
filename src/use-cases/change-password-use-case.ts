import type { UsersRepository } from "@/repositories/users-repository"
import type { User } from "@prisma/client"
import { compare, hash } from 'bcryptjs'
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error"

const BCRYPT_ROUNDS = 12

interface ChangePasswordUseCaseRequest {
  userId: string
  currentPassword: string
  newPassword: string
}

interface ChangePasswordUseCaseResponse {
  user: User
}

export class ChangePasswordUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
    currentPassword,
    newPassword
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const doesPasswordMatch = await compare(currentPassword, user.passwordHash)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    const passwordHash = await hash(newPassword, BCRYPT_ROUNDS)

    const changePassword = await this.usersRepository.changePassword(userId, passwordHash)

    return { user: changePassword }
  }
}