export interface PageQuery {
  page: number
  pageSize: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationState extends PageQuery {
  total: number
  totalPages: number
}
