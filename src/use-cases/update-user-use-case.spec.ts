import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UpdateUseCase } from './update-user-use-case'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: InMemoryUserRepository
let sut: UpdateUseCase

describe('Update User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new UpdateUseCase(userRepository)
  })

  it('should not update a deleted user', async () => {
    const user = await userRepository.create({
      name: 'fulano',
      email: 'teste@gmail.com',
      passwordHash: '123456',
    })

    await userRepository.softDelete(user.id)

    await expect(() =>
      sut.execute({
        userId: user.id,
        name: 'ciclano',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
