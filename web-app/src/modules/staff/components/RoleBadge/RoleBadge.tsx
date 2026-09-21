import { ROLE_LABELS } from '@core/auth'
import type { UserRole } from '@core/auth'
import { classNames } from '@shared/utils'

import './RoleBadge.css'

export interface RoleBadgeProps {
  role: UserRole
}

const toneOf = (role: UserRole): string => {
  if (role === 'SUPER_ADMIN') return 'super'
  if (role === 'ADMIN') return 'admin'
  if (role === 'MANAGER') return 'manager'
  if (role === 'CUSTOMER') return 'customer'
  return 'agent'
}

export const RoleBadge = ({ role }: RoleBadgeProps) => (
  <span className={classNames('role-badge', `role-badge--${toneOf(role)}`)}>{ROLE_LABELS[role]}</span>
)
