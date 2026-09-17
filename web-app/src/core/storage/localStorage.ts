/** Safe, JSON-aware wrapper around window.localStorage. */
const isAvailable = (): boolean => {
  try {
    const probe = '__taxedge_probe__'
    window.localStorage.setItem(probe, probe)
    window.localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

const memoryFallback = new Map<string, string>()
const available = typeof window !== 'undefined' && isAvailable()

const readRaw = (key: string): string | null =>
  available ? window.localStorage.getItem(key) : (memoryFallback.get(key) ?? null)

const writeRaw = (key: string, value: string): void => {
  if (available) window.localStorage.setItem(key, value)
  else memoryFallback.set(key, value)
}

export const localStore = {
  get<T>(key: string): T | null {
    const raw = readRaw(key)
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T): void {
    try {
      writeRaw(key, JSON.stringify(value))
    } catch {
      /* quota or serialization failure - ignore */
    }
  },
  remove(key: string): void {
    if (available) window.localStorage.removeItem(key)
    else memoryFallback.delete(key)
  },
  clear(): void {
    if (available) window.localStorage.clear()
    else memoryFallback.clear()
  },
}
