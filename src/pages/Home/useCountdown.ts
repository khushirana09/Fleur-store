import { useEffect, useState } from 'react'

/**
 * Returns a live countdown from now + `initialHours` hours.
 * The end time is stored once so it doesn't reset on re-renders.
 */
export function useCountdown(initialHours = 48) {
  const initialMs = initialHours * 60 * 60 * 1000
  const [timeLeft, setTimeLeft] = useState(initialMs)

  useEffect(() => {
    const endTime = Date.now() + initialMs

    const tick = () => {
      const remaining = endTime - Date.now()
      if (remaining <= 0) {
        setTimeLeft(0)
        return true
      }
      setTimeLeft(remaining)
      return false
    }

    if (tick()) return

    const interval = setInterval(() => {
      if (tick()) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [initialMs])

  const totalSecs = Math.floor(timeLeft / 1000)
  const hours     = Math.floor(totalSecs / 3600)
  const minutes   = Math.floor((totalSecs % 3600) / 60)
  const seconds   = totalSecs % 60

  return { hours, minutes, seconds }
}