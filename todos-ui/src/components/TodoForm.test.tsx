import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TodoForm } from './TodoForm'
import type { Category } from '../api/types'
import { useCreateTodo } from '../hooks/useTodos'

vi.mock('../hooks/useTodos', () => ({
  useCreateTodo: vi.fn(),
}))

const categories: Category[] = [
  { id: 1, name: 'Home' },
  { id: 2, name: 'Work' },
]

describe('TodoForm', () => {
  it('submits the trimmed title and selected category id', async () => {
    const mutate = vi.fn()
    vi.mocked(useCreateTodo).mockReturnValue({ mutate, isPending: false } as never)
    const user = userEvent.setup()

    render(<TodoForm categories={categories} />)

    await user.type(screen.getByPlaceholderText('What needs to be done?'), '  Buy milk  ')
    await user.selectOptions(screen.getByLabelText('Category'), 'Work')
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    expect(mutate).toHaveBeenCalledWith(
      { title: 'Buy milk', categoryId: 2 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    )
  })

  it('shows a validation error and does not submit when the title is empty', async () => {
    const mutate = vi.fn()
    vi.mocked(useCreateTodo).mockReturnValue({ mutate, isPending: false } as never)
    const user = userEvent.setup()

    render(<TodoForm categories={categories} />)
    await user.click(screen.getByRole('button', { name: 'Add task' }))

    expect(await screen.findByText('A task name is required.')).toBeInTheDocument()
    expect(mutate).not.toHaveBeenCalled()
  })

  it('disables inputs when there are no categories yet', () => {
    vi.mocked(useCreateTodo).mockReturnValue({ mutate: vi.fn(), isPending: false } as never)

    render(<TodoForm categories={[]} />)

    expect(screen.getByPlaceholderText('Add a category first')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Add task' })).toBeDisabled()
  })
})
