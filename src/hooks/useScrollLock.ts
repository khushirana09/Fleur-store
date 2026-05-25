import { useEffect } from 'react'

/**
 * Locks the document body scroll when `locked` is true.
 * Automatically restores the original overflow value on cleanup.
 *
 * Usage:
 *   useScrollLock(isCartOpen)
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return

    const originalOverflow = window.getComputedStyle(document.body).overflow
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight

    // Compensate for scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow      = 'hidden'
    document.body.style.paddingRight  = `${scrollbarWidth}px`

    return () => {
      document.body.style.overflow     = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [locked])
}