import type { UsersRepository } from "@/repositories/users-repository";
import type { User } from "@prisma/client";

interface SoftDeleteUserUseCaseRequest {
  userId: string
}

interface SoftDeleteUserUseCaseResponse {
  user: User
}

export class SoftDeleteUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    userId,
  }: SoftDeleteUserUseCaseRequest): Promise<SoftDeleteUserUseCaseResponse> {
    const user = await this.usersRepository.softDelete(userId)

    return { user }
  }
}