export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiListResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

/** Shape used by every module hook so the UI renders consistently. */
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}
