import type { StorageAdapter } from './adapter'

export class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return fallback
      return JSON.parse(raw) as T
    } catch {
      console.warn(`[LocalStorageAdapter] Failed to read key: ${key}, using fallback.`)
      return fallback
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`[LocalStorageAdapter] Failed to write key: ${key}`, err)
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (err) {
      console.error(`[LocalStorageAdapter] Failed to remove key: ${key}`, err)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (err) {
      console.error(`[LocalStorageAdapter] Failed to clear storage`, err)
    }
  }
}

export const localAdapter = new LocalStorageAdapter()
