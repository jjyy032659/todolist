import type { Category } from '../api/types'

export interface CategoryColor {
  bg: string
  text: string
  border: string
  dot: string
}

export const categoryColors: CategoryColor[] = [
  { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', dot: 'bg-blue-500' },
  { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500' },
  { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500' },
  { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500' },
  { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300', dot: 'bg-pink-500' },
  { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300', dot: 'bg-teal-500' },
  { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', dot: 'bg-purple-500' },
  { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500' },
]

export function getCategoryColorMap(categories: Category[]) {
  const sorted = [...categories].sort((a, b) => a.id - b.id)
  const map = new Map<number, CategoryColor>()
  sorted.forEach((category, index) => {
    map.set(category.id, categoryColors[index % categoryColors.length])
  })
  return map
}
