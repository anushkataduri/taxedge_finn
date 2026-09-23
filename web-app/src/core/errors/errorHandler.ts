import axios from 'axios'

import { AppError } from './AppError'
import type { AppErrorKind } from './AppError'

interface ApiErrorBody {
  message?: string
  code?: string
  errors?: Record<string, string[]>
}

const kindFromStatus = (status?: number): AppErrorKind => {
  if (status === undefined) return 'network'
  if (status === 401) return 'unauthorized'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'notFound'
  if (status === 400 || status === 422) return 'validation'
  if (status >= 500) return 'server'
  return 'unknown'
}

/** Normalises anything thrown by the network layer into an AppError. */
export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error

  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const status = error.response?.status
    const body = error.response?.data
    return new AppError(body?.message ?? error.message ?? 'Request failed', {
      kind: kindFromStatus(status),
      status,
      code: body?.code,
      details: body?.errors,
      cause: error,
    })
  }

  if (error instanceof Error) {
    return new AppError(error.message, { cause: error })
  }

  return new AppError('Something went wrong. Please try again.')
}

/** User-facing copy for an error. */
export const messageFor = (error: unknown): string => toAppError(error).message
