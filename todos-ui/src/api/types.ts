export interface Category {
  id: number
  name: string
}

export interface Todo {
  id: number
  title: string
  isComplete: boolean
  category: Category
}

export interface CreateCategoryInput {
  name: string
}

export interface UpdateCategoryInput {
  name?: string
}

export interface CreateTodoInput {
  title: string
  isComplete?: boolean
  categoryId: number
}

export interface UpdateTodoInput {
  title?: string
  isComplete?: boolean
  categoryId?: number
}
