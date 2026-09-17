import { useRef } from 'react'
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react'

import './OTPInput.css'

export interface OTPInputProps {
  value: string
  length?: number
  error?: string
  onChange: (value: string) => void
}

export const OTPInput = ({ value, length = 6, error, onChange }: OTPInputProps) => {
  const inputs = useRef<Array<HTMLInputElement | null>>([])
  const digits = value.padEnd(length, ' ').slice(0, length).split('')

  const write = (index: number, digit: string) => {
    const next = digits.map((d, i) => (i === index ? digit : d)).join('').trimEnd()
    onChange(next.replace(/\s/g, ''))
  }

  const handleChange = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const digit = event.target.value.replace(/\D/g, '').slice(-1)
    if (!digit) return
    write(index, digit)
    inputs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Backspace') return
    event.preventDefault()
    write(index, ' ')
    inputs.current[Math.max(0, index - 1)]?.focus()
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) onChange(pasted)
  }

  return (
    <div className="otp">
      <div className="otp__boxes" onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            ref={(element) => {
              inputs.current[index] = element
            }}
            className={`otp__box${error ? ' otp__box--invalid' : ''}`}
            inputMode="numeric"
            maxLength={1}
            aria-label={`Digit ${index + 1}`}
            value={digit.trim()}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
          />
        ))}
      </div>
      {error && <p className="otp__error">{error}</p>}
    </div>
  )
}
