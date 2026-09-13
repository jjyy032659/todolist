import type { Category } from '../api/types'
import type { CategoryColor } from '../lib/categoryColors'

interface CategoryFilterProps {
  categories: Category[]
  colorMap: Map<number, CategoryColor>
  selected: string[]
  onChange: (next: string[]) => void
}

export function CategoryFilter({ categories, colorMap, selected, onChange }: CategoryFilterProps) {
  if (categories.length === 0) return null

  function toggle(name: string) {
    onChange(selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name])
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-500">Filter:</span>
      {categories.map((category) => {
        const active = selected.includes(category.name)
        const color = colorMap.get(category.id)
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => toggle(category.name)}
            aria-pressed={active}
            className={
              active
                ? `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${color?.bg} ${color?.text} ${color?.border}`
                : 'inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600'
            }
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color?.dot ?? 'bg-gray-400'}`} />
            {category.name}
          </button>
        )
      })}
      {selected.length > 0 && (
        <button type="button" onClick={() => onChange([])} className="text-xs font-medium text-gray-500 hover:underline">
          Clear
        </button>
      )}
    </div>
  )
}
