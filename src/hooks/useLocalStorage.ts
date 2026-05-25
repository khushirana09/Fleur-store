import { useCallback, useState } from 'react'

/**
 * A useState-like hook that syncs state to localStorage.
 *
 * Usage:
 *   const [theme, setTheme] = useLocalStorage('theme', 'dark')
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch {
        console.warn(`[useLocalStorage] Could not set key "${key}"`)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch {
      console.warn(`[useLocalStorage] Could not remove key "${key}"`)
    }
  }, [initialValue, key])

  return [storedValue, setValue, removeValue] as const
}