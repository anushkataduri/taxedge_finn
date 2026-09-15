import { Badge, Card, EmptyState, Loader } from '@shared/components'
import { STATUS_LABELS, STATUS_TONES } from '@shared/constants'
import { formatDate } from '@shared/utils'

import { useProfile } from '../../hooks/useProfile'
import './Profile.css'

export const Profile = () => {
  const { data, isLoading, error } = useProfile()

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <h1 className="profile-page__title">Profile</h1>
        <p className="profile-page__subtitle">Your details, business info and preferences.</p>
      </header>

      {isLoading && <Loader label="Loading Profile" />}
      {error && <EmptyState title="Could not load Profile" description={error} />}

      {!isLoading && !error && (
        <Card title="Profile" subtitle="Wire this module up to the real API in services/profileService.ts">
          <ul className="profile-page__list">
            {(data ?? []).map((item) => (
              <li className="profile-page__row" key={item.id}>
                <div>
                  <p className="profile-page__row-title">{item.title}</p>
                  <p className="profile-page__row-meta">
                    {item.reference} · {formatDate(item.updatedAt)}
                  </p>
                </div>
                <Badge tone={STATUS_TONES[item.status]}>{STATUS_LABELS[item.status]}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

export default Profile
