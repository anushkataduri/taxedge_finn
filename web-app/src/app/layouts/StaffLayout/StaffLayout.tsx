import { Outlet } from 'react-router-dom'

import { useAppStore, useAuthStore } from '@store/index'

import { StaffHeader } from './StaffHeader'
import { StaffSidebar } from './StaffSidebar'
import './StaffLayout.css'

export const StaffLayout = () => {
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)

  if (!user) return null

  return (
    <div className={`staff-shell${isSidebarOpen ? '' : ' staff-shell--collapsed'}`}>
      <StaffSidebar role={user.role} />

      <div className="staff-shell__main">
        <StaffHeader user={user} onSignOut={signOut} />
        <main className="staff-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
