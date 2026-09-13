import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Category, Todo } from '../api/types'
import type { CategoryColor } from '../lib/categoryColors'
import { useDeleteTodo, useUpdateTodo } from '../hooks/useTodos'
import { CategoryBadge } from './CategoryBadge'

interface TodoItemProps {
  todo: Todo
  categories: Category[]
  color: CategoryColor
}

interface EditFormValues {
  title: string
  categoryId: string
}

export function TodoItem({ todo, categories, color }: TodoItemProps) {
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const { register, handleSubmit, reset } = useForm<EditFormValues>({
    defaultValues: { title: todo.title, categoryId: String(todo.category.id) },
  })

  function startEdit() {
    reset({ title: todo.title, categoryId: String(todo.category.id) })
    setEditing(true)
  }

  function onSave(values: EditFormValues) {
    updateTodo.mutate(
      { id: todo.id, input: { title: values.title.trim(), categoryId: Number(values.categoryId) } },
      { onSuccess: () => setEditing(false) },
    )
  }

  function toggleComplete() {
    updateTodo.mutate({ id: todo.id, input: { isComplete: !todo.isComplete } })
  }

  if (editing) {
    return (
      <li className="flex flex-col gap-2 rounded-lg border border-blue-400 bg-white p-3 sm:flex-row sm:items-center">
        <input
          autoFocus
          className="min-w-0 flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500"
          {...register('title', { required: true })}
        />
        <select
          aria-label="Category"
          className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500"
          {...register('categoryId', { required: true })}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={handleSubmit(onSave)} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
            Save
          </button>
          <button type="button" onClick={() => setEditing(false)} className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600">
            Cancel
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={toggleComplete}
        aria-label={todo.isComplete ? 'Mark as not complete' : 'Mark as complete'}
        className="h-4 w-4 shrink-0 accent-green-600"
      />
      <span className={`flex-1 truncate text-sm ${todo.isComplete ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
        {todo.title}
      </span>
      <CategoryBadge name={todo.category.name} color={color} />
      <div className="flex shrink-0 gap-1">
        <button type="button" onClick={startEdit} className="rounded px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900">
          Edit
        </button>
        {confirmingDelete ? (
          <>
            <button type="button" onClick={() => deleteTodo.mutate(todo.id)} className="rounded px-2 py-1 text-xs font-medium text-red-600">
              Confirm
            </button>
            <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded px-2 py-1 text-xs text-gray-400">
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="rounded px-2 py-1 text-xs font-medium text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </li>
  )
}
