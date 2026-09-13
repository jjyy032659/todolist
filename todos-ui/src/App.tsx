import { useMemo, useState } from 'react'
import { Header } from './components/Header'
import { CategoryManager } from './components/CategoryManager'
import { CategoryFilter } from './components/CategoryFilter'
import { SummarySection } from './components/SummarySection'
import { TodoForm } from './components/TodoForm'
import { TodoList } from './components/TodoList'
import { ErrorBanner } from './components/ErrorBanner'
import { useCategories } from './hooks/useCategories'
import { useTodos } from './hooks/useTodos'
import { getCategoryColorMap } from './lib/categoryColors'

function App() {
  const [filter, setFilter] = useState<string[]>([])

  const categoriesQuery = useCategories()
  const allTodosQuery = useTodos()
  const filteredTodosQuery = useTodos(filter.length > 0 ? filter : undefined)

  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data])
  const colorMap = useMemo(() => getCategoryColorMap(categories), [categories])

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
        {(categoriesQuery.isError || allTodosQuery.isError) && (
          <ErrorBanner message="Could not reach the API. Is the backend running on http://localhost:8080?" />
        )}

        <SummarySection todos={allTodosQuery.data ?? []} categories={categories} colorMap={colorMap} />

        <CategoryManager categories={categories} colorMap={colorMap} />

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-900">Tasks</h2>
          <TodoForm categories={categories} />
          <CategoryFilter categories={categories} colorMap={colorMap} selected={filter} onChange={setFilter} />
          {filteredTodosQuery.isLoading ? (
            <p className="text-sm text-gray-400">Loading tasks…</p>
          ) : filteredTodosQuery.isError ? (
            <ErrorBanner message="Could not load tasks." />
          ) : (
            <TodoList todos={filteredTodosQuery.data ?? []} categories={categories} colorMap={colorMap} />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
