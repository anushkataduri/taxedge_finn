import { describe, expect, it } from 'vitest'
import { AppError } from '@core/errors/AppError'
import { messageFor, toAppError } from '@core/errors/errorHandler'

describe('errorHandler', () => {
  it('preserves existing AppError instances', () => {
    const original = new AppError('Session expired', { kind: 'unauthorized', status: 401 })
    const result = toAppError(original)
    expect(result).toBe(original)
    expect(result.kind).toBe('unauthorized')
    expect(result.status).toBe(401)
  })

  it('converts generic Error objects to AppError', () => {
    const error = new Error('Syntax issue')
    const result = toAppError(error)
    expect(result).toBeInstanceOf(AppError)
    expect(result.message).toBe('Syntax issue')
    expect(result.kind).toBe('unknown')
  })

  it('converts unknown non-error primitives gracefully', () => {
    const result = toAppError('weird string error')
    expect(result).toBeInstanceOf(AppError)
    expect(result.message).toBe('Something went wrong. Please try again.')
  })

  it('provides convenient messageFor helper', () => {
    const err = new Error('Database connection failed')
    expect(messageFor(err)).toBe('Database connection failed')
  })
})
