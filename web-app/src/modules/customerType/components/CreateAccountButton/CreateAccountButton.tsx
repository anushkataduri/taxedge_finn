import type { FC } from 'react'
import './CreateAccountButton.css'

export interface CreateAccountButtonProps {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  label?: string
}

export const CreateAccountButton: FC<CreateAccountButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'Create account →',
}) => {
  return (
    <button
      type="button"
      className="customer-type-submit-btn"
      onClick={onClick}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="customer-type-submit-btn__spinner" aria-hidden="true" />
      ) : (
        label
      )}
    </button>
  )
}
