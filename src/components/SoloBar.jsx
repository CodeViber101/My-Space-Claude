import { useState } from 'react'

export default function SoloBar({ t, score, roundOver, onGuess, onNext }) {
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState(null) // 'hit' | 'miss' | null

  function submit(e) {
    e.preventDefault()
    const guess = value.trim()
    if (!guess) return
    const hit = onGuess(guess)
    setFeedback(hit ? 'hit' : 'miss')
    setValue('')
    setTimeout(() => setFeedback(null), 600)
  }

  return (
    <div className="solobar">
      <div className="solo-score">
        {t.soloScore}: <strong>{score}</strong>
      </div>
      {roundOver ? (
        <div className="round-over">
          <span>{t.roundOver}</span>
          <button onClick={onNext}>{t.nextQuestion} ›</button>
        </div>
      ) : (
        <form className="guess-form" onSubmit={submit}>
          <input
            className={`guess-input ${feedback ?? ''}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.guessPlaceholder}
            autoFocus
          />
          <button type="submit">{t.guess}</button>
        </form>
      )}
    </div>
  )
}
