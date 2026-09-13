import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CategoryFilter } from './CategoryFilter'
import type { Category } from '../api/types'
import { getCategoryColorMap } from '../lib/categoryColors'

const categories: Category[] = [
  { id: 1, name: 'Home' },
  { id: 2, name: 'Work' },
]
const colorMap = getCategoryColorMap(categories)

describe('CategoryFilter', () => {
  it('adds a category to the selection when its chip is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CategoryFilter categories={categories} colorMap={colorMap} selected={[]} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Home' }))

    expect(onChange).toHaveBeenCalledWith(['Home'])
  })

  it('removes an already-selected category when clicked again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <CategoryFilter categories={categories} colorMap={colorMap} selected={['Home']} onChange={onChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'Home' }))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('clears the whole selection via the Clear link', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <CategoryFilter
        categories={categories}
        colorMap={colorMap}
        selected={['Home', 'Work']}
        onChange={onChange}
      />,
    )

    await user.click(screen.getByText('Clear'))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('renders nothing when there are no categories', () => {
    const { container } = render(
      <CategoryFilter categories={[]} colorMap={new Map()} selected={[]} onChange={vi.fn()} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
