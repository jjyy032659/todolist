import type { Category, Todo } from '../api/types'
import type { CategoryColor } from '../lib/categoryColors'

interface SummarySectionProps {
  todos: Todo[]
  categories: Category[]
  colorMap: Map<number, CategoryColor>
}

export function SummarySection({ todos, categories, colorMap }: SummarySectionProps) {
  if (categories.length === 0 && todos.length === 0) return null

  const total = todos.length
  const completed = todos.filter((todo) => todo.isComplete).length
  const counts = categories.map((category) => ({
    category,
    count: todos.filter((todo) => todo.category.id === category.id).length,
  }))

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      <StatTile label="Total tasks" value={total} accentClass="bg-gray-400" />
      <StatTile label="Completed" value={completed} accentClass="bg-green-500" />
      {counts.map(({ category, count }) => (
        <StatTile
          key={category.id}
          label={category.name}
          value={count}
          accentClass={colorMap.get(category.id)?.dot ?? 'bg-gray-400'}
        />
      ))}
    </section>
  )
}

function StatTile({ label, value, accentClass }: { label: string; value: number; accentClass: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white py-3 pl-4 pr-3">
      <span className={`absolute inset-y-0 left-0 w-1 ${accentClass}`} />
      <p className="truncate text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}
