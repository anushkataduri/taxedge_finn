import { useCallback, useState } from 'react'

export interface UseModalResult {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useModal = (initialOpen = false): UseModalResult => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((value) => !value), [])

  return { isOpen, open, close, toggle }
}
