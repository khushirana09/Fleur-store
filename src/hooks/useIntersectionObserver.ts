import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

/**
 * Observes when an element enters the viewport.
 * Used for lazy-loading images, animations on scroll, and infinite scroll triggers.
 *
 * Usage:
 *   const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 })
 *   <div ref={ref}>{isIntersecting && <ExpensiveComponent />}</div>
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options

  const ref = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const frozen = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (frozen.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting
        setIsIntersecting(visible)
        if (visible && freezeOnceVisible) {
          frozen.current = true
          observer.disconnect()
        }
      },
      { threshold, root, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, root, rootMargin, freezeOnceVisible])

  return { ref, isIntersecting }
}