import { useEffect, useRef, useState } from 'react'

const DURATIONS = [30, 60, 90]

export default function Timer({ t, onExpire }) {
  const [duration, setDuration] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  // Drive the countdown while running.
  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          onExpire?.()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, onExpire])

  function toggle() {
    if (remaining === 0) {
      setRemaining(duration)
      setRunning(true)
    } else {
      setRunning((r) => !r)
    }
  }

  function reset() {
    setRunning(false)
    setRemaining(duration)
  }

  function pickDuration(d) {
    setDuration(d)
    setRunning(false)
    setRemaining(d)
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const low = remaining <= 10
  const expired = remaining === 0

  return (
    <div className="timer">
      <div className={`timer-display ${low ? 'low' : ''} ${expired ? 'expired' : ''}`}>
        {expired ? t.timeUp : `${mm}:${ss}`}
      </div>
      <div className="timer-controls">
        <button onClick={toggle}>{running ? `⏸ ${t.pause}` : `▶ ${t.start}`}</button>
        <button onClick={reset}>↺ {t.reset}</button>
        <div className="timer-durations">
          {DURATIONS.map((d) => (
            <button
              key={d}
              className={duration === d ? 'active' : ''}
              onClick={() => pickDuration(d)}
            >
              {d}s
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
