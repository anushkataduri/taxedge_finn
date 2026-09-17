import type { FC, ReactNode } from 'react'
import type { CustomerTypeId } from '../../types/customerType.types'
import './CustomerTypeCard.css'

export interface CustomerTypeCardProps {
  id: CustomerTypeId
  title: string
  description: string
  icon: ReactNode
  isSelected: boolean
  onSelect: (id: CustomerTypeId) => void
}

export const CustomerTypeCard: FC<CustomerTypeCardProps> = ({
  id,
  title,
  description,
  icon,
  isSelected,
  onSelect,
}) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      className={`customer-type-card ${isSelected ? 'customer-type-card--selected' : ''}`}
      onClick={() => onSelect(id)}
    >
      {/* Left Icon */}
      <div className={`customer-type-card__icon ${isSelected ? 'customer-type-card__icon--selected' : ''}`}>
        {icon}
      </div>

      {/* Middle Text Info */}
      <div className="customer-type-card__info">
        <span className="customer-type-card__title">{title}</span>
        <span className="customer-type-card__desc">{description}</span>
      </div>

      {/* Right Selection Radio / Check Indicator */}
      <div
        className={`customer-type-card__radio ${isSelected ? 'customer-type-card__radio--selected' : ''}`}
        aria-hidden="true"
      >
        {isSelected && (
          <svg className="customer-type-card__check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  )
}
