import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { SoftDeleteUseCase } from './soft-delete-user-use-case'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let userRepository: InMemoryUserRepository
let sut: SoftDeleteUseCase

describe('Soft Delete User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new SoftDeleteUseCase(userRepository)
  })

  it('should soft delete a user', async () => {
    const user = await userRepository.create({
      name: 'fulano',
      email: 'teste@gmail.com',
      passwordHash: '123456',
    })

    const { user: deletedUser } = await sut.execute({
      userId: user.id,
    })

    expect(deletedUser.deletedAt).toEqual(expect.any(Date))
  })

  it('should hide a deleted user from active user queries', async () => {
    const user = await userRepository.create({
      name: 'fulano',
      email: 'teste@gmail.com',
      passwordHash: '123456',
    })

    await sut.execute({
      userId: user.id,
    })

    await expect(userRepository.findById(user.id)).resolves.toBeNull()
    await expect(userRepository.findByEmail(user.email)).resolves.toBeNull()
  })

  it('should not soft delete an already deleted user', async () => {
    const user = await userRepository.create({
      name: 'fulano',
      email: 'teste@gmail.com',
      passwordHash: '123456',
    })

    await sut.execute({
      userId: user.id,
    })

    await expect(() =>
      sut.execute({
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
