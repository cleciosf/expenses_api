import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register-user-use-case'
import { inMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: inMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new inMemoryUserRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register an user', async () => {
    const { user } = await sut.execute({
      name: 'fulano',
      email: 'teste@gmail.com',
      password: '123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'fulano',
      email: 'teste@gmail.com',
      password: '123'
    })

    const isPasswordCorrectlyHashed = await compare(
      '123',
      user.passwordHash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same e-mail twice', async () => {
    const email = 'teste@gmail.com'

    await sut.execute({
      name: 'fulano',
      email,
      password: '123'
    })

    await expect(() =>
      sut.execute({
        name: 'fulano',
        email,
        password: '123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})

