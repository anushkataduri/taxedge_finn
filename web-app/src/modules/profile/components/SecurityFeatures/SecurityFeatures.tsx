import type { FC, ReactNode } from 'react'
import './SecurityFeatures.css'

export interface SecurityFeatureItem {
  id: string
  title: string
  status: 'On' | 'Active'
  icon: ReactNode
}

const DEFAULT_SECURITY_FEATURES: SecurityFeatureItem[] = [
  {
    id: 'encrypted-storage',
    title: 'Encrypted document storage',
    status: 'On',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm8 14c0 .66-3.58 2-8 2s-8-1.34-8-2v-2.17c2.19 1.34 5.37 1.97 8 1.97s5.81-.63 8-1.97V18zm0-4c0 .66-3.58 2-8 2s-8-1.34-8-2v-2.17c2.19 1.34 5.37 1.97 8 1.97s5.81-.63 8-1.97V14zm0-4c0 .66-3.58 2-8 2s-8-1.34-8-2V7.83c2.19 1.34 5.37 1.97 8 1.97s5.81-.63 8-1.97V10z" />
      </svg>
    ),
  },
  {
    id: 'role-access',
    title: 'Role-based staff access',
    status: 'On',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
  {
    id: 'access-log',
    title: 'Document access log',
    status: 'On',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    ),
  },
]

export interface SecurityFeaturesProps {
  features?: SecurityFeatureItem[]
}

export const SecurityFeatures: FC<SecurityFeaturesProps> = ({
  features = DEFAULT_SECURITY_FEATURES,
}) => {
  return (
    <div className="security-features" aria-label="Security and encryption features">
      <ul className="security-features__card">
        {features.map((item) => (
          <li className="security-feature-row" key={item.id}>
            <div className="security-feature-row__left">
              <div className="security-feature-row__icon-circle">{item.icon}</div>
              <span className="security-feature-row__title">{item.title}</span>
            </div>
            <span className="security-feature-row__status-badge">{item.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
