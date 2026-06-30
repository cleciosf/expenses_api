import { hash } from 'bcryptjs'
import type { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import type { User } from '@prisma/client'
import { normalizeEmail } from '@/utils/normalize-email'

const BCRYPT_ROUNDS = 12
interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const normalizedEmail = normalizeEmail(email)

    const userWithSameEmail = await this.usersRepository.findByEmail(normalizedEmail)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, BCRYPT_ROUNDS)

    const user = await this.usersRepository.create({
      name,
      email: normalizedEmail,
      passwordHash: password_hash,
    })

    return {
      user,
    }
  }
}
