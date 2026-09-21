import { Link } from 'react-router-dom'

import { EmptyState, Button } from '@shared/components'

import { routePaths } from '@core/config'
import './NotFound.css'

export const NotFound = () => (
  <div className="not-found">
    <EmptyState
      title="Page not found"
      description="The page you are looking for has moved or never existed."
      icon={<span>404</span>}
      action={
        <Link to={routePaths.dashboard}>
          <Button>Back to dashboard</Button>
        </Link>
      }
    />
  </div>
)
