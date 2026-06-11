import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register-user-use-case'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let userRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(userRepository)
  })

  it('should be able to register a user', async () => {
    const { user } = await sut.execute({
      name: 'fulano',
      email: 'teste@gmail.com',
      password: '123'
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

  it('should normalize the user e-mail upon registration', async () => {
    const { user } = await sut.execute({
      name: 'fulano',
      email: '  Teste@Gmail.com  ',
      password: '123',
    })

    expect(user.email).toEqual('teste@gmail.com')
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

  it('should not be able to register the same active e-mail with different casing', async () => {
    await sut.execute({
      name: 'fulano',
      email: 'Teste@Gmail.com',
      password: '123',
    })

    await expect(() =>
      sut.execute({
        name: 'ciclano',
        email: 'teste@gmail.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should be able to register with an e-mail from a deleted user', async () => {
    const email = 'teste@gmail.com'

    const { user: deletedUser } = await sut.execute({
      name: 'fulano',
      email,
      password: '123',
    })

    deletedUser.deletedAt = new Date()

    const { user } = await sut.execute({
      name: 'ciclano',
      email,
      password: '123',
    })

    expect(user.id).not.toEqual(deletedUser.id)
    expect(user.email).toEqual(email)
  })
})

