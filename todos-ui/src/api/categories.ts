import { apiClient } from './client'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from './types'

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories')
    return data
  },
  create: async (input: CreateCategoryInput): Promise<Category> => {
    const { data } = await apiClient.post<Category>('/categories', input)
    return data
  },
  update: async (id: number, input: UpdateCategoryInput): Promise<Category> => {
    const { data } = await apiClient.patch<Category>(`/categories/${id}`, input)
    return data
  },
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`)
  },
}
