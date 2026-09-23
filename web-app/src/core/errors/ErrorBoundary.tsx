import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

import './ErrorBoundary.css'
import { errorTracker } from './errorTracker'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    errorTracker.captureException(error, {
      extra: { componentStack: info.componentStack },
    })
  }

  handleReload = (): void => {
    this.setState({ error: null })
    window.location.reload()
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <div className="error-boundary">
        <div className="error-boundary__card">
          <h1 className="error-boundary__title">Something went wrong</h1>
          <p className="error-boundary__message">{error.message}</p>
          <button className="error-boundary__action" type="button" onClick={this.handleReload}>
            Reload the page
          </button>
        </div>
      </div>
    )
  }
}
