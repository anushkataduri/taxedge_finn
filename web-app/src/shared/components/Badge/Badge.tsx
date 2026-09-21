import type { ReactNode } from 'react'

import { classNames } from '../../utils/formatUtils'
import type { StatusTone } from '../../types/common.types'
import './Badge.css'

export interface BadgeProps {
  tone?: StatusTone
  children: ReactNode
  className?: string
}

export const Badge = ({ tone = 'neutral', children, className }: BadgeProps) => (
  <span className={classNames('badge', `badge--${tone}`, className)}>{children}</span>
)
