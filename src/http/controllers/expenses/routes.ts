import type { FastifyInstance } from "fastify"
import { register } from "./register"
import { jwtVerify } from "@/http/middlewares/verify-jwt"

export async function expenseRoutes(app: FastifyInstance) {
  app.post('/expenses', { onRequest: [jwtVerify] }, register)
}