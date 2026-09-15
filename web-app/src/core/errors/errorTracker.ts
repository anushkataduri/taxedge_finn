/**
 * Production Error Tracking & Observability Abstraction
 * 
 * Provides unified error reporting, breadcrumb tracking, and contextual logging.
 * Ready for integration with Sentry, Datadog, or LogRocket via the registered reporter.
 */

export interface ErrorContext {
  user?: {
    id?: string
    email?: string
    role?: string
  }
  tags?: Record<string, string | number | boolean>
  extra?: Record<string, unknown>
}

export type ErrorReporter = (error: Error, context?: ErrorContext) => void

class ErrorTracker {
  private reporter: ErrorReporter | null = null
  private context: ErrorContext = {}

  /** Register a third-party error reporter (e.g. Sentry.captureException) */
  public setReporter(reporter: ErrorReporter): void {
    this.reporter = reporter
  }

  /** Set ambient context (such as logged-in user or active workspace) */
  public setContext(context: Partial<ErrorContext>): void {
    this.context = {
      ...this.context,
      ...context,
      tags: { ...this.context.tags, ...context.tags },
      extra: { ...this.context.extra, ...context.extra },
    }
  }

  /** Clears current context upon logout */
  public clearContext(): void {
    this.context = {}
  }

  /** Capture an exception to active reporter or fallback to console */
  public captureException(error: unknown, context?: Partial<ErrorContext>): void {
    const err = error instanceof Error ? error : new Error(String(error))
    const mergedContext: ErrorContext = {
      ...this.context,
      ...context,
      tags: { ...this.context.tags, ...context?.tags },
      extra: { ...this.context.extra, ...context?.extra },
    }

    if (this.reporter) {
      try {
        this.reporter(err, mergedContext)
      } catch (reporterError) {
        console.error('[ErrorTracker] Custom reporter failed:', reporterError)
      }
    } else {
      // In development or when no reporter registered, safely log to console
      if (import.meta.env.DEV || import.meta.env.MODE !== 'production') {
        console.error('[ErrorTracker Captured Error]:', err, mergedContext)
      }
    }
  }

  /** Log a breadcrumb for diagnosing user navigation/actions */
  public addBreadcrumb(category: string, message: string, data?: Record<string, unknown>): void {
    if (import.meta.env.DEV) {
      console.debug(`[Breadcrumb:${category}]`, message, data ?? '')
    }
  }
}

export const errorTracker = new ErrorTracker()
