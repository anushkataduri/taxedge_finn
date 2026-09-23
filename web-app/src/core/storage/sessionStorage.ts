/** Safe, JSON-aware wrapper around window.sessionStorage. */
const available = typeof window !== 'undefined' && (() => {
  try {
    const probe = '__taxedge_probe__'
    window.sessionStorage.setItem(probe, probe)
    window.sessionStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
})()

const memoryFallback = new Map<string, string>()

export const sessionStore = {
  get<T>(key: string): T | null {
    const raw = available ? window.sessionStorage.getItem(key) : (memoryFallback.get(key) ?? null)
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T): void {
    const raw = JSON.stringify(value)
    if (available) window.sessionStorage.setItem(key, raw)
    else memoryFallback.set(key, raw)
  },
  remove(key: string): void {
    if (available) window.sessionStorage.removeItem(key)
    else memoryFallback.delete(key)
  },
}
