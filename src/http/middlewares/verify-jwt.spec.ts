import { beforeEach, describe, expect, it, vi } from 'vitest'
import { jwtVerify } from './verify-jwt'

const { findByIdMock } = vi.hoisted(() => ({
  findByIdMock: vi.fn(),
}))

vi.mock('@/repositories/prisma/prisma-users-repository', () => ({
  PrismaUserRepository: vi.fn(function () {
    return {
      findById: findByIdMock,
    }
  }),
}))

function makeReply() {
  return {
    status: vi.fn().mockReturnThis(),
    send: vi.fn(),
  }
}

describe('JWT Verify Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should allow a valid access token from an active user', async () => {
    const request = {
      jwtVerify: vi.fn().mockResolvedValue(undefined),
      user: {
        sub: 'user-id',
        type: 'access',
      },
    }
    const reply = makeReply()

    findByIdMock.mockResolvedValueOnce({
      id: 'user-id',
    })

    await jwtVerify(request as never, reply as never)

    expect(reply.status).not.toHaveBeenCalled()
    expect(reply.send).not.toHaveBeenCalled()
  })

  it('should reject a valid access token from a deleted user', async () => {
    const request = {
      jwtVerify: vi.fn().mockResolvedValue(undefined),
      user: {
        sub: 'user-id',
        type: 'access',
      },
    }
    const reply = makeReply()

    findByIdMock.mockResolvedValueOnce(null)

    await jwtVerify(request as never, reply as never)

    expect(reply.status).toHaveBeenCalledWith(401)
    expect(reply.send).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })
})
