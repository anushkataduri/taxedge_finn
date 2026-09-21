import { useCallback, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { ZodType } from 'zod'

export type FormErrors<T> = Partial<Record<keyof T & string, string>> & { form?: string }

export interface UseZodFormResult<TInput extends Record<string, unknown>> {
  values: TInput
  errors: FormErrors<TInput>
  isSubmitting: boolean
  setValue: <K extends keyof TInput>(field: K, value: TInput[K]) => void
  handleChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  setFormError: (message: string) => void
  reset: () => void
}

/**
 * Minimal zod-backed form state. Swap for react-hook-form later without
 * changing the shape components rely on.
 */
export const useZodForm = <TInput extends Record<string, unknown>, TOutput>(
  schema: ZodType<TOutput, TInput>,
  initialValues: TInput,
  onValid: (values: TOutput) => Promise<void> | void,
): UseZodFormResult<TInput> => {
  const [values, setValues] = useState<TInput>(initialValues)
  const [errors, setErrors] = useState<FormErrors<TInput>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback(<K extends keyof TInput>(field: K, value: TInput[K]) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      const next = { ...current } as Record<string, string | undefined>
      delete next[String(field)]
      delete next.form
      return next as FormErrors<TInput>
    })
  }, [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target
      setValue(name as keyof TInput, value as TInput[keyof TInput])
    },
    [setValue],
  )

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const result = schema.safeParse(values)

      if (!result.success) {
        const fieldErrors: Record<string, string> = {}
        for (const issue of result.error.issues) {
          const field = issue.path[0]
          if (typeof field === 'string' && fieldErrors[field] === undefined) {
            fieldErrors[field] = issue.message
          }
        }
        setErrors(fieldErrors as FormErrors<TInput>)
        return
      }

      setErrors({})
      setIsSubmitting(true)
      void Promise.resolve(onValid(result.data))
        .catch((error: unknown) => {
          setErrors({ form: error instanceof Error ? error.message : 'Something went wrong' } as FormErrors<TInput>)
        })
        .finally(() => setIsSubmitting(false))
    },
    [schema, values, onValid],
  )

  const setFormError = useCallback(
    (message: string) => setErrors({ form: message } as FormErrors<TInput>),
    [],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { values, errors, isSubmitting, setValue, handleChange, handleSubmit, setFormError, reset }
}
