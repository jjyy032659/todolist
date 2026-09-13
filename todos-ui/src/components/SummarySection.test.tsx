import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SummarySection } from './SummarySection'
import type { Category, Todo } from '../api/types'
import { getCategoryColorMap } from '../lib/categoryColors'

const categories: Category[] = [
  { id: 1, name: 'Home' },
  { id: 2, name: 'Work' },
]

const todos: Todo[] = [
  { id: 1, title: 'Buy bread', isComplete: false, category: categories[0] },
  { id: 2, title: 'Finish API', isComplete: true, category: categories[1] },
  { id: 3, title: 'Write tests', isComplete: false, category: categories[1] },
]

const colorMap = getCategoryColorMap(categories)

describe('SummarySection', () => {
  it('shows total, completed, and per-category counts', () => {
    render(<SummarySection todos={todos} categories={categories} colorMap={colorMap} />)

    expect(screen.getByText('Total tasks').nextSibling).toHaveTextContent('3')
    expect(screen.getByText('Completed').nextSibling).toHaveTextContent('1')
    expect(screen.getByText('Home').nextSibling).toHaveTextContent('1')
    expect(screen.getByText('Work').nextSibling).toHaveTextContent('2')
  })

  it('renders nothing when there are no categories and no todos', () => {
    const { container } = render(<SummarySection todos={[]} categories={[]} colorMap={new Map()} />)
    expect(container).toBeEmptyDOMElement()
  })
})
