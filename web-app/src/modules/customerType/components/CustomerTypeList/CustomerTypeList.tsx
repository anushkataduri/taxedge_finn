import type { FC } from 'react'
import { CustomerTypeCard } from '../CustomerTypeCard/CustomerTypeCard'
import type { CustomerTypeId, CustomerTypeOption } from '../../types/customerType.types'
import './CustomerTypeList.css'

export interface CustomerTypeListProps {
  options: CustomerTypeOption[]
  selectedId: CustomerTypeId | null
  onSelect: (id: CustomerTypeId) => void
}

export const CustomerTypeList: FC<CustomerTypeListProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="customer-type-list" role="radiogroup" aria-label="Customer Type Selection">
      {options.map((option) => (
        <CustomerTypeCard
          key={option.id}
          id={option.id}
          title={option.title}
          description={option.description}
          icon={option.icon}
          isSelected={selectedId === option.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
