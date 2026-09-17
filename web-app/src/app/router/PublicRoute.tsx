import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@store/index'

import { routePaths } from '@core/config'

/** Keeps signed-in users with complete profiles out of the login / register screens. */
export const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  return isAuthenticated && user?.isProfileComplete ? (
    <Navigate to={routePaths.dashboard} replace />
  ) : (
    <Outlet />
  )
}

