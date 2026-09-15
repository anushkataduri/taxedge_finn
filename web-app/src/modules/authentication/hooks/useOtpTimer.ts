import { useCallback, useEffect, useState } from 'react'

/** Counts down the "resend code" cooldown. */
export const useOtpTimer = (seconds = 30) => {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) return
    const timer = window.setInterval(() => setRemaining((value) => value - 1), 1000)
    return () => window.clearInterval(timer)
  }, [remaining])

  const restart = useCallback(() => setRemaining(seconds), [seconds])

  return { remaining, canResend: remaining <= 0, restart }
}
