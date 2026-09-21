import type { FC } from 'react'
import './BackButton.css'

export interface BackButtonProps {
  onClick?: () => void
  label?: string
}

export const BackButton: FC<BackButtonProps> = ({ onClick, label = 'Back' }) => {
  return (
    <button
      type="button"
      className="customer-type-back-btn"
      onClick={onClick}
      aria-label={`Go back to previous step: ${label}`}
    >
      <svg
        className="customer-type-back-btn__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      <span className="customer-type-back-btn__label">{label}</span>
    </button>
  )
}
