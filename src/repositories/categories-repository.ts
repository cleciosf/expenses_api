import type { Category, Prisma } from "@prisma/client"

export interface CategoriesRepository {
  create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>
  findById(id: string): Promise<Category | null>
  findByNameAndOwnerId(name: string, ownerId: string): Promise<Category | null>
  update(
    id: string,
    ownerId: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<Category>
}
