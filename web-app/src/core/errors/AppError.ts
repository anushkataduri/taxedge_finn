export type AppErrorKind =
  | 'network'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'validation'
  | 'server'
  | 'unknown'

export interface AppErrorOptions {
  kind?: AppErrorKind
  status?: number
  code?: string
  details?: Record<string, string[]>
  cause?: unknown
}

/** The single error shape the UI is allowed to see. */
export class AppError extends Error {
  readonly kind: AppErrorKind
  readonly status?: number
  readonly code?: string
  readonly details?: Record<string, string[]>

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = 'AppError'
    this.kind = options.kind ?? 'unknown'
    this.status = options.status
    this.code = options.code
    this.details = options.details
  }

  get isAuthError(): boolean {
    return this.kind === 'unauthorized' || this.kind === 'forbidden'
  }
}

export const isAppError = (value: unknown): value is AppError => value instanceof AppError
