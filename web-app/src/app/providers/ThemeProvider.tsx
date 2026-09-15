import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { useAppStore } from '@store/index'

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useAppStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return <>{children}</>
}
