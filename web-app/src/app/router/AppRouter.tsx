import { Suspense } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useAppStore } from '@store/index'
import { Loader } from '@shared/components'

import { routeConfig } from './routeConfig'

const router = createBrowserRouter(routeConfig)

// Clear notifications immediately whenever the user navigates between sections
let currentPath = window.location.pathname
router.subscribe((state) => {
  if (state.location.pathname !== currentPath) {
    currentPath = state.location.pathname
    useAppStore.getState().clearToasts()
  }
})

export const AppRouter = () => (
  <Suspense fallback={<Loader fullPage />}>
    <RouterProvider router={router} />
  </Suspense>
)
