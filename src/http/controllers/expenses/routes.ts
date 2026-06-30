import type { FastifyInstance } from "fastify"
import { register } from "./register"
import { getExpenseDetails } from "./getExpense"
import { fetchUserExpenses } from "./fetchUserExpenses"
import { jwtVerify } from "@/http/middlewares/verify-jwt"

export async function expenseRoutes(app: FastifyInstance) {
  app.post('/expenses', { onRequest: [jwtVerify] }, register)
  app.get('/expenses', { onRequest: [jwtVerify] }, fetchUserExpenses)
  app.get('/expenses/:expenseId', { onRequest: [jwtVerify] }, getExpenseDetails)
}
