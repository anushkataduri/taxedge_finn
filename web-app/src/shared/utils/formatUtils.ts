export const titleCase = (value: string): string =>
  value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())

export const initialsOf = (fullName: string): string =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

export const maskMobile = (mobile: string): string =>
  mobile.length < 4 ? mobile : `${'*'.repeat(mobile.length - 4)}${mobile.slice(-4)}`

export const maskPan = (pan: string): string => (pan.length === 10 ? `${pan.slice(0, 3)}****${pan.slice(-3)}` : pan)

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let size = bytes / 1024
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

export const classNames = (...values: Array<string | false | null | undefined>): string =>
  values.filter(Boolean).join(' ')
