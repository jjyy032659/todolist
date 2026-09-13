import type { Category, Todo } from '../api/types'
import type { CategoryColor } from '../lib/categoryColors'
import { TodoItem } from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  categories: Category[]
  colorMap: Map<number, CategoryColor>
}

export function TodoList({ todos, categories, colorMap }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">No tasks yet.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          categories={categories}
          color={colorMap.get(todo.category.id) ?? { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300', dot: 'bg-gray-400' }}
        />
      ))}
    </ul>
  )
}
