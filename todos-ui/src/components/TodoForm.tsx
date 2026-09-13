import { useForm } from 'react-hook-form'
import type { Category } from '../api/types'
import { useCreateTodo } from '../hooks/useTodos'

interface TodoFormProps {
  categories: Category[]
}

interface TodoFormValues {
  title: string
  categoryId: string
}

export function TodoForm({ categories }: TodoFormProps) {
  const createTodo = useCreateTodo()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({ defaultValues: { title: '', categoryId: '' } })

  const noCategories = categories.length === 0

  function onSubmit(values: TodoFormValues) {
    createTodo.mutate(
      { title: values.title.trim(), categoryId: Number(values.categoryId) },
      { onSuccess: () => reset({ title: '', categoryId: values.categoryId }) },
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <input
          placeholder={noCategories ? 'Add a category first' : 'What needs to be done?'}
          disabled={noCategories}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 disabled:opacity-50"
          {...register('title', { required: true, maxLength: 200 })}
        />
        {errors.title && <p className="mt-1 text-xs text-red-600">A task name is required.</p>}
      </div>
      <select
        disabled={noCategories}
        aria-label="Category"
        className="rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 disabled:opacity-50"
        {...register('categoryId', { required: true })}
      >
        <option value="">Category…</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={noCategories || createTodo.isPending}
        className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
      >
        Add task
      </button>
    </form>
  )
}
