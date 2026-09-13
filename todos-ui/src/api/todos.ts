import { apiClient } from './client'
import type { Todo, CreateTodoInput, UpdateTodoInput } from './types'

export const todosApi = {
  getAll: async (categoryNames?: string[]): Promise<Todo[]> => {
    const params = new URLSearchParams()
    categoryNames?.forEach((name) => params.append('category', name))
    const { data } = await apiClient.get<Todo[]>('/todos', { params })
    return data
  },
  getById: async (id: number): Promise<Todo> => {
    const { data } = await apiClient.get<Todo>(`/todos/${id}`)
    return data
  },
  create: async (input: CreateTodoInput): Promise<Todo> => {
    const { data } = await apiClient.post<Todo>('/todos', input)
    return data
  },
  update: async (id: number, input: UpdateTodoInput): Promise<Todo> => {
    const { data } = await apiClient.patch<Todo>(`/todos/${id}`, input)
    return data
  },
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/todos/${id}`)
  },
}
