import type { FastifyInstance } from "fastify";
import { createCategory } from "./create";
import { jwtVerify } from "@/http/middlewares/verify-jwt";
import { updateCategory } from "./update";

export async function categoriesRoutes(app: FastifyInstance) {
  app.post("/categories", { onRequest: [jwtVerify] }, createCategory);
  app.patch("/categories/:categoryId", { onRequest: [jwtVerify] }, updateCategory);
}
