import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { todosApi } from '../api/todos'
import type { CreateTodoInput, UpdateTodoInput } from '../api/types'

export function todosKey(categoryNames?: string[]) {
  return ['todos', categoryNames ? [...categoryNames].sort() : []] as const
}

export function useTodos(categoryNames?: string[]) {
  return useQuery({
    queryKey: todosKey(categoryNames),
    queryFn: () => todosApi.getAll(categoryNames),
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTodoInput) => todosApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTodoInput }) =>
      todosApi.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => todosApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })
}
