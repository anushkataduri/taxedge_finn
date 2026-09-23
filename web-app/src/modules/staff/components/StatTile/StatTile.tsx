import './StatTile.css'

export interface StatTileProps {
  label: string
  value: string
  hint?: string
}

export const StatTile = ({ label, value, hint }: StatTileProps) => (
  <article className="stat-tile">
    <p className="stat-tile__label">{label}</p>
    <p className="stat-tile__value">{value}</p>
    {hint && <p className="stat-tile__hint">{hint}</p>}
  </article>
)
