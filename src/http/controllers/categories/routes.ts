import type { FastifyInstance } from "fastify"
import { createCategory } from "./create"
import { jwtVerify } from "@/http/middlewares/verify-jwt"
import { updateCategory } from "./update"
import { deleteCategory } from "./delete"
import { getCategoryDetails } from "./getCategory"
import { fetchUserCategories } from "./fetchUserCategories"

export async function categoriesRoutes(app: FastifyInstance) {
  app.post("/categories", { onRequest: [jwtVerify] }, createCategory)
  app.get("/categories", { onRequest: [jwtVerify] }, fetchUserCategories)
  app.get("/categories/:categoryId", { onRequest: [jwtVerify] }, getCategoryDetails)
  app.patch("/categories/:categoryId", { onRequest: [jwtVerify] }, updateCategory)
  app.delete("/categories/:categoryId", { onRequest: [jwtVerify] }, deleteCategory)
}
