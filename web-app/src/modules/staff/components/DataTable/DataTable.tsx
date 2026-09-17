import type { ReactNode } from 'react'

import { Loader } from '@shared/components'
import { classNames } from '@shared/utils'

import './DataTable.css'

export interface DataTableColumn<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right'
  width?: string
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>
  rows: T[]
  rowKey: (row: T) => string
  isLoading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

/** One table used across the staff screens so they all behave the same. */
export const DataTable = <T,>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  emptyMessage = 'Nothing to show',
  onRowClick,
}: DataTableProps<T>) => {
  if (isLoading) return <Loader label="Loading" />

  return (
    <div className="data-table__wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={column.align === 'right' ? 'is-right' : undefined}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="data-table__empty" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          )}

          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={classNames(onRowClick && 'is-clickable')}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.align === 'right' ? 'is-right' : undefined}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
