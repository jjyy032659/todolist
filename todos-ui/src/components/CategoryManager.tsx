import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Category } from '../api/types'
import type { CategoryColor } from '../lib/categoryColors'
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '../hooks/useCategories'
import { MAX_CATEGORIES } from '../lib/constants'

interface CategoryManagerProps {
  categories: Category[]
  colorMap: Map<number, CategoryColor>
}

interface AddCategoryFormValues {
  name: string
}

export function CategoryManager({ categories, colorMap }: CategoryManagerProps) {
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [confirmingId, setConfirmingId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCategoryFormValues>({ defaultValues: { name: '' } })

  const atLimit = categories.length >= MAX_CATEGORIES

  function onAdd(values: AddCategoryFormValues) {
    createCategory.mutate({ name: values.name.trim() }, { onSuccess: () => reset({ name: '' }) })
  }

  function startEdit(category: Category) {
    setConfirmingId(null)
    setEditingId(category.id)
    setEditValue(category.name)
  }

  function saveEdit(id: number) {
    const name = editValue.trim()
    if (!name) return
    updateCategory.mutate({ id, input: { name } }, { onSuccess: () => setEditingId(null) })
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Categories</h2>
        <span className="text-xs text-gray-400">
          {categories.length}/{MAX_CATEGORIES}
        </span>
      </div>

      <ul className="mb-3 flex flex-col gap-1">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50">
            <span className={`h-2 w-2 shrink-0 rounded-full ${colorMap.get(category.id)?.dot ?? 'bg-gray-400'}`} />
            {editingId === category.id ? (
              <>
                <input
                  autoFocus
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') saveEdit(category.id)
                    if (event.key === 'Escape') setEditingId(null)
                  }}
                  className="min-w-0 flex-1 rounded border border-gray-300 px-1.5 py-0.5 text-sm text-gray-900 outline-none focus:border-blue-500"
                />
                <button type="button" onClick={() => saveEdit(category.id)} className="text-xs font-medium text-green-600">
                  Save
                </button>
                <button type="button" onClick={() => setEditingId(null)} className="text-xs text-gray-400">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 truncate text-sm text-gray-900">{category.name}</span>
                <button
                  type="button"
                  onClick={() => startEdit(category)}
                  className="text-xs font-medium text-gray-500 hover:text-gray-900"
                  aria-label={`Edit ${category.name}`}
                >
                  Edit
                </button>
                {confirmingId === category.id ? (
                  <span className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        deleteCategory.mutate(category.id)
                        setConfirmingId(null)
                      }}
                      className="font-medium text-red-600"
                    >
                      Confirm
                    </button>
                    <button type="button" onClick={() => setConfirmingId(null)} className="text-gray-400">
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingId(category.id)}
                    className="text-xs font-medium text-red-500 hover:text-red-700"
                    aria-label={`Delete ${category.name}`}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </li>
        ))}
        {categories.length === 0 && <li className="px-2 py-1.5 text-sm text-gray-400">No categories yet — add one below.</li>}
      </ul>

      <form onSubmit={handleSubmit(onAdd)} className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <input
            placeholder={atLimit ? `Limit of ${MAX_CATEGORIES} reached` : 'New category name'}
            disabled={atLimit}
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 disabled:opacity-50"
            {...register('name', { required: true, maxLength: 40 })}
          />
          <button
            type="submit"
            disabled={atLimit || createCategory.isPending}
            className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
          >
            Add
          </button>
        </div>
        {errors.name && <p className="text-xs text-red-600">Category name is required.</p>}
        {createCategory.isError && <p className="text-xs text-red-600">Could not create category. It may already exist.</p>}
        {deleteCategory.isError && <p className="text-xs text-red-600">Could not delete that category.</p>}
      </form>
    </section>
  )
}
