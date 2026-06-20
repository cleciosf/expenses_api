import fastify from 'fastify'
import { fastifyJwt } from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyHelmet from '@fastify/helmet'
import { env } from './env'
import { ZodError } from 'zod'
import { userRoutes } from './http/controllers/users/routes'
import { ResourceNotFoundError } from './use-cases/errors/resource-not-found-error'
import { categoriesRoutes } from './http/controllers/categories/routes'

export const app = fastify()

app.register(fastifyHelmet)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10min'
  }
})

app.register(fastifyCookie)

app.register(userRoutes)
app.register(categoriesRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({ message: 'Validation Error', issues: error.format() })
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
