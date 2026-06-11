import type { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { jwtVerify } from "@/http/middlewares/verify-jwt";
import { refresh } from "./refresh";
import { profile } from './profile'
import { updateUser } from "./update";
import { changePassword } from "./change-password";

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/me', { onRequest: [jwtVerify] }, profile)
  app.put('/users', { onRequest: [jwtVerify] }, updateUser)
  app.put('/users/password', { onRequest: [jwtVerify] }, changePassword)
} 