import { useEffect, useState } from 'react'

/**
 * Delays updating the returned value until after `delay` ms
 * have passed since the last change.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(searchInput, 400)
 *   // only updates 400ms after user stops typing
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}