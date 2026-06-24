import { useEffect, useMemo, useState } from 'react'
import { strings } from './i18n.js'
import { loadQuestions, saveQuestions, resetQuestions } from './store.js'
import { matchAnswer } from './match.js'
import { playDing, playBuzzer, playReveal } from './sound.js'
import Board from './components/Board.jsx'
import TeamPanel from './components/TeamPanel.jsx'
import StrikeBar from './components/StrikeBar.jsx'
import SoloBar from './components/SoloBar.jsx'
import Editor from './components/Editor.jsx'

const MULTIPLIERS = [1, 2, 3]

export default function App() {
  const [lang, setLang] = useState('en')
  const [mode, setMode] = useState('host') // 'host' | 'solo'
  const [soundOn, setSoundOn] = useState(true)
  const [editing, setEditing] = useState(false)

  const [questionSet, setQuestionSet] = useState(() => loadQuestions('en'))
  const [qIndex, setQIndex] = useState(0)
  const [revealed, setRevealed] = useState({})
  const [strikes, setStrikes] = useState(0)
  const [flashStrike, setFlashStrike] = useState(false)
  const [multiplier, setMultiplier] = useState(1)
  const [soloScore, setSoloScore] = useState(0)

  const [teams, setTeams] = useState([
    { name: 'Team 1', score: 0 },
    { name: 'Team 2', score: 0 },
  ])

  const t = strings[lang]

  // Reload the question set whenever the language changes.
  useEffect(() => {
    const set = loadQuestions(lang)
    setQuestionSet(set)
    setQIndex(0)
    clearRound()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const current = questionSet[qIndex] ?? { question: '', answers: [] }

  const pool = useMemo(() => {
    const base = current.answers.reduce(
      (sum, a, i) => (revealed[i] ? sum + a.points : sum),
      0,
    )
    return base * multiplier
  }, [current, revealed, multiplier])

  const roundOver = mode === 'solo' && strikes >= 3

  function ding() {
    if (soundOn) playDing()
  }
  function buzz() {
    if (soundOn) playBuzzer()
  }

  function clearRound() {
    setRevealed({})
    setStrikes(0)
    setMultiplier(1)
    setSoloScore(0)
  }

  function reveal(i) {
    if (revealed[i]) return
    setRevealed((r) => ({ ...r, [i]: true }))
    if (soundOn) playReveal()
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
    buzz()
    setTimeout(() => setFlashStrike(false), 700)
  }

  function changeQuestion(nextIndex) {
    if (questionSet.length === 0) return
    const idx = (nextIndex + questionSet.length) % questionSet.length
    setQIndex(idx)
    clearRound()
  }

  function awardPool(teamIdx) {
    if (pool === 0) return
    setTeams((teamsArr) =>
      teamsArr.map((team, i) =>
        i === teamIdx ? { ...team, score: team.score + pool } : team,
      ),
    )
    ding()
  }

  function updateTeam(teamIdx, patch) {
    setTeams((teamsArr) =>
      teamsArr.map((team, i) => (i === teamIdx ? { ...team, ...patch } : team)),
    )
  }

  // Single-player: returns true on a correct guess.
  function handleGuess(guess) {
    const idx = matchAnswer(guess, current.answers, revealed)
    if (idx === -1) {
      addStrike()
      return false
    }
    setRevealed((r) => ({ ...r, [idx]: true }))
    setSoloScore((s) => s + current.answers[idx].points)
    ding()
    return true
  }

  // Editor persistence.
  function handleEditorChange(next) {
    setQuestionSet(next)
    saveQuestions(lang, next)
    if (qIndex >= next.length) setQIndex(Math.max(0, next.length - 1))
  }

  function handleEditorReset() {
    if (!confirm(t.resetConfirm)) return
    const fresh = resetQuestions(lang)
    setQuestionSet(fresh)
    setQIndex(0)
    clearRound()
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>{t.title}</h1>

        <div className="toolbar">
          <div className="seg" role="group" aria-label={t.mode}>
            <button
              className={mode === 'host' ? 'active' : ''}
              onClick={() => {
                setMode('host')
                clearRound()
              }}
            >
              {t.host}
            </button>
            <button
              className={mode === 'solo' ? 'active' : ''}
              onClick={() => {
                setMode('solo')
                clearRound()
              }}
            >
              {t.solo}
            </button>
          </div>

          <div className="seg" role="group" aria-label={t.language}>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
              EN
            </button>
            <button className={lang === 'id' ? 'active' : ''} onClick={() => setLang('id')}>
              ID
            </button>
          </div>

          <button
            className="toggle"
            onClick={() => setSoundOn((s) => !s)}
            title={t.sound}
            aria-pressed={soundOn}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>

          <button className={`toggle ${editing ? 'active' : ''}`} onClick={() => setEditing((e) => !e)}>
            {editing ? t.done : `✎ ${t.edit}`}
          </button>
        </div>
      </header>

      {editing ? (
        <Editor
          t={t}
          questions={questionSet}
          onChange={handleEditorChange}
          onReset={handleEditorReset}
        />
      ) : (
        <>
          <div className="qnav">
            <button onClick={() => changeQuestion(qIndex - 1)} aria-label="Previous">
              ‹
            </button>
            <select value={qIndex} onChange={(e) => changeQuestion(Number(e.target.value))}>
              {questionSet.map((q, i) => (
                <option key={i} value={i}>
                  {i + 1}. {q.question}
                </option>
              ))}
            </select>
            <button onClick={() => changeQuestion(qIndex + 1)} aria-label="Next">
              ›
            </button>
          </div>

          <main className="stage">
            {mode === 'host' && (
              <TeamPanel
                t={t}
                team={teams[0]}
                pool={pool}
                onAward={() => awardPool(0)}
                onChange={(patch) => updateTeam(0, patch)}
                side="left"
              />
            )}

            <section className="center">
              <h2 className="question">{current.question}</h2>

              <Board
                answers={current.answers}
                revealed={revealed}
                onReveal={reveal}
                onHide={hide}
                interactive={mode === 'host'}
              />

              <StrikeBar strikes={strikes} flash={flashStrike} />

              {mode === 'host' ? (
                <div className="controls">
                  <div className="pool">
                    {t.pool}: <strong>{pool}</strong>
                    <div className="multiplier">
                      {MULTIPLIERS.map((m) => (
                        <button
                          key={m}
                          className={multiplier === m ? 'active' : ''}
                          onClick={() => setMultiplier(m)}
                        >
                          {m}×
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="control-buttons">
                    <button className="strike-btn" onClick={addStrike}>
                      ✖ {t.strike}
                    </button>
                    <button onClick={revealAll}>{t.revealAll}</button>
                    <button onClick={clearRound}>{t.resetRound}</button>
                  </div>
                </div>
              ) : (
                <SoloBar
                  t={t}
                  score={soloScore}
                  roundOver={roundOver}
                  onGuess={handleGuess}
                  onNext={() => changeQuestion(qIndex + 1)}
                />
              )}
            </section>

            {mode === 'host' && (
              <TeamPanel
                t={t}
                team={teams[1]}
                pool={pool}
                onAward={() => awardPool(1)}
                onChange={(patch) => updateTeam(1, patch)}
                side="right"
              />
            )}
          </main>

          <footer className="hint">{mode === 'host' ? t.hintHost : t.hintSolo}</footer>
        </>
      )}
    </div>
  )
}
