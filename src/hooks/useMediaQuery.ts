import { useEffect, useState } from 'react'

/**
 * Returns true whenever the CSS media query matches.
 *
 * Usage:
 *   const isLargeScreen = useMediaQuery('(min-width: 1024px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => window.matchMedia(query).matches
  )

  useEffect(() => {
    const mq      = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

/* ── Convenience shortcuts ─────────────────────────────── */

/** true on screens ≤ 768px */
export const useIsMobile  = () => useMediaQuery('(max-width: 768px)')

/** true on screens ≤ 1024px */
export const useIsTablet  = () => useMediaQuery('(max-width: 1024px)')

/** true on screens ≥ 1024px */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')