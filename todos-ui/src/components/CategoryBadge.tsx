import type { CategoryColor } from '../lib/categoryColors'

interface CategoryBadgeProps {
  name: string
  color: CategoryColor
}

export function CategoryBadge({ name, color }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex max-w-[9rem] items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${color.bg} ${color.text} ${color.border}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color.dot}`} />
      <span className="truncate">{name}</span>
    </span>
  )
}
