import { Outlet } from 'react-router-dom'

import './MainLayout.css'

/** Bare layout for public marketing / legal pages. */
export const MainLayout = () => (
  <div className="main-layout">
    <main className="main-layout__content u-container">
      <Outlet />
    </main>
  </div>
)
