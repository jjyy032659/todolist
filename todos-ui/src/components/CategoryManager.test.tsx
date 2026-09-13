import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CategoryManager } from './CategoryManager'
import type { Category } from '../api/types'
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '../hooks/useCategories'
import { MAX_CATEGORIES } from '../lib/constants'
import type { CategoryColor } from '../lib/categoryColors'

vi.mock('../hooks/useCategories', () => ({
  useCreateCategory: vi.fn(),
  useUpdateCategory: vi.fn(),
  useDeleteCategory: vi.fn(),
}))

function makeCategories(count: number): Category[] {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Category ${i + 1}` }))
}

const colorMap = new Map<number, CategoryColor>()

beforeEach(() => {
  vi.mocked(useUpdateCategory).mockReturnValue({ mutate: vi.fn(), isPending: false } as never)
  vi.mocked(useDeleteCategory).mockReturnValue({ mutate: vi.fn(), isError: false } as never)
})

describe('CategoryManager', () => {
  it('submits a trimmed new category name', async () => {
    const mutate = vi.fn()
    vi.mocked(useCreateCategory).mockReturnValue({ mutate, isPending: false, isError: false } as never)
    const user = userEvent.setup()

    render(<CategoryManager categories={makeCategories(2)} colorMap={colorMap} />)

    await user.type(screen.getByPlaceholderText('New category name'), '  Errands  ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(mutate).toHaveBeenCalledWith(
      { name: 'Errands' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
  })

  it('disables the add form once the category limit is reached', () => {
    vi.mocked(useCreateCategory).mockReturnValue({ mutate: vi.fn(), isPending: false, isError: false } as never)

    render(<CategoryManager categories={makeCategories(MAX_CATEGORIES)} colorMap={colorMap} />)

    expect(screen.getByText(`${MAX_CATEGORIES}/${MAX_CATEGORIES}`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled()
    expect(screen.getByPlaceholderText(`Limit of ${MAX_CATEGORIES} reached`)).toBeDisabled()
  })

  it('asks for confirmation before deleting a category', async () => {
    const mutate = vi.fn()
    vi.mocked(useCreateCategory).mockReturnValue({ mutate: vi.fn(), isPending: false, isError: false } as never)
    vi.mocked(useDeleteCategory).mockReturnValue({ mutate, isError: false } as never)
    const user = userEvent.setup()

    render(<CategoryManager categories={makeCategories(1)} colorMap={colorMap} />)

    await user.click(screen.getByRole('button', { name: 'Delete Category 1' }))
    expect(mutate).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(mutate).toHaveBeenCalledWith(1)
  })
})
