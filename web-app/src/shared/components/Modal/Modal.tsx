import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

import { classNames } from '../../utils/formatUtils'
import './Modal.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export const Modal = ({ isOpen, onClose, title, footer, size = 'md', children }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="modal" role="presentation" onClick={onClose}>
      <div
        className={classNames('modal__panel', `modal__panel--${size}`)}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button className="modal__close" type="button" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
