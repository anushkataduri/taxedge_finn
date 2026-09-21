import { classNames } from '../../utils/formatUtils'
import './Loader.css'

export interface LoaderProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

export const Loader = ({ label = 'Loading', size = 'md', fullPage = false }: LoaderProps) => (
  <div className={classNames('loader', `loader--${size}`, fullPage && 'loader--full')} role="status">
    <span className="loader__ring" aria-hidden="true" />
    <span className="u-visually-hidden">{label}</span>
  </div>
)
