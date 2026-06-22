import { useMemo, useState } from 'react'
import { questions } from './data/questions.js'
import Board from './components/Board.jsx'
import TeamPanel from './components/TeamPanel.jsx'
import StrikeBar from './components/StrikeBar.jsx'

const MULTIPLIERS = [
  { label: 'Single', value: 1 },
  { label: 'Double', value: 2 },
  { label: 'Triple', value: 3 },
]

export default function App() {
  const [qIndex, setQIndex] = useState(0)
  // revealed[i] = true means answer i is shown on the board
  const [revealed, setRevealed] = useState({})
  const [strikes, setStrikes] = useState(0)
  const [flashStrike, setFlashStrike] = useState(false)
  const [multiplier, setMultiplier] = useState(1)

  const [teams, setTeams] = useState([
    { name: 'Team 1', score: 0 },
    { name: 'Team 2', score: 0 },
  ])

  const current = questions[qIndex]

  const pool = useMemo(() => {
    return current.answers.reduce(
      (sum, a, i) => (revealed[i] ? sum + a.points : sum),
      0,
    ) * multiplier
  }, [current, revealed, multiplier])

  function reveal(i) {
    setRevealed((r) => ({ ...r, [i]: true }))
  }

  function hide(i) {
    setRevealed((r) => {
      const next = { ...r }
      delete next[i]
      return next
    })
  }

  function revealAll() {
    const all = {}
    current.answers.forEach((_, i) => (all[i] = true))
    setRevealed(all)
  }

  function addStrike() {
    setStrikes((s) => Math.min(3, s + 1))
    setFlashStrike(true)
    setTimeout(() => setFlashStrike(false), 700)
  }

  function resetRound() {
    setRevealed({})
    setStrikes(0)
    setMultiplier(1)
  }

  function changeQuestion(nextIndex) {
    const idx = (nextIndex + questions.length) % questions.length
    setQIndex(idx)
    setRevealed({})
    setStrikes(0)
    setMultiplier(1)
  }

  function awardPool(teamIdx) {
    if (pool === 0) return
    setTeams((t) =>
      t.map((team, i) =>
        i === teamIdx ? { ...team, score: team.score + pool } : team,
      ),
    )
  }

  function updateTeam(teamIdx, patch) {
    setTeams((t) => t.map((team, i) => (i === teamIdx ? { ...team, ...patch } : team)))
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Family&nbsp;100</h1>
        <div className="qnav">
          <button onClick={() => changeQuestion(qIndex - 1)} aria-label="Previous question">
            ‹
          </button>
          <select value={qIndex} onChange={(e) => changeQuestion(Number(e.target.value))}>
            {questions.map((q, i) => (
              <option key={i} value={i}>
                {i + 1}. {q.question}
              </option>
            ))}
          </select>
          <button onClick={() => changeQuestion(qIndex + 1)} aria-label="Next question">
            ›
          </button>
        </div>
      </header>

      <main className="stage">
        <TeamPanel
          team={teams[0]}
          pool={pool}
          onAward={() => awardPool(0)}
          onChange={(patch) => updateTeam(0, patch)}
          side="left"
        />

        <section className="center">
          <h2 className="question">{current.question}</h2>

          <Board
            answers={current.answers}
            revealed={revealed}
            onReveal={reveal}
            onHide={hide}
          />

          <StrikeBar strikes={strikes} flash={flashStrike} />

          <div className="controls">
            <div className="pool">
              Pool: <strong>{pool}</strong>
              <div className="multiplier">
                {MULTIPLIERS.map((m) => (
                  <button
                    key={m.value}
                    className={multiplier === m.value ? 'active' : ''}
                    onClick={() => setMultiplier(m.value)}
                    title={`${m.label} points`}
                  >
                    {m.value}×
                  </button>
                ))}
              </div>
            </div>
            <div className="control-buttons">
              <button className="strike-btn" onClick={addStrike}>
                ✖ Strike
              </button>
              <button onClick={revealAll}>Reveal all</button>
              <button onClick={resetRound}>Reset round</button>
            </div>
          </div>
        </section>

        <TeamPanel
          team={teams[1]}
          pool={pool}
          onAward={() => awardPool(1)}
          onChange={(patch) => updateTeam(1, patch)}
          side="right"
        />
      </main>

      <footer className="hint">
        Host tool · Click an answer slot to reveal it · Use “Strike” for wrong guesses · Award the
        pool to the team that wins the round.
      </footer>
    </div>
  )
}
