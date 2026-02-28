import { useEffect, useRef } from 'react'

/**
 * Run a callback at a fixed interval (e.g. for refreshing CMP every 15s).
 */
export function useInterval(callback: () => void, delayMs: number | null): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delayMs == null) return
    const id = setInterval(() => savedCallback.current(), delayMs)
    return () => clearInterval(id)
  }, [delayMs])
}
