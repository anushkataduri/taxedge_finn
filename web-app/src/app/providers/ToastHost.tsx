import { useEffect } from 'react'
import { useAppStore, type Toast } from '@store/index'

import './ToastHost.css'

interface ToastItemProps {
  toast: Toast
  onDismiss: (id: string) => void
}

const ToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  useEffect(() => {
    // Automatically dismiss after 4 seconds (4000ms)
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 4000)

    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className={`toast toast--${toast.tone}`} role="alert">
      <span className="toast__message">{toast.message}</span>
      <button
        type="button"
        className="toast__close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
      >
        &times;
      </button>
    </div>
  )
}

export const ToastHost = () => {
  const toasts = useAppStore((state) => state.toasts)
  const dismissToast = useAppStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="toast-host" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}
