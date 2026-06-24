import { useRef, useState } from 'react'

export default function Editor({ t, lang, questions, onChange, onReset }) {
  const fileRef = useRef(null)
  const [copied, setCopied] = useState(false)

  function exportJson() {
    const blob = new Blob([JSON.stringify(questions, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `family100-questions-${lang}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(questions, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard may be blocked; export remains available
    }
  }

  function isValidSet(data) {
    return (
      Array.isArray(data) &&
      data.every(
        (q) =>
          q &&
          typeof q.question === 'string' &&
          Array.isArray(q.answers) &&
          q.answers.every(
            (a) => a && typeof a.text === 'string' && typeof a.points === 'number',
          ),
      )
    )
  }

  function importJson(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-importing the same file later
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!isValidSet(data)) {
          alert(t.importError)
          return
        }
        if (questions.length > 0 && !confirm(t.importConfirm)) return
        onChange(data)
      } catch {
        alert(t.importError)
      }
    }
    reader.readAsText(file)
  }

  function updateQuestionText(qi, text) {
    const next = clone(questions)
    next[qi].question = text
    onChange(next)
  }

  function updateAnswer(qi, ai, patch) {
    const next = clone(questions)
    next[qi].answers[ai] = { ...next[qi].answers[ai], ...patch }
    onChange(next)
  }

  function addAnswer(qi) {
    const next = clone(questions)
    next[qi].answers.push({ text: '', points: 0 })
    onChange(next)
  }

  function deleteAnswer(qi, ai) {
    const next = clone(questions)
    next[qi].answers.splice(ai, 1)
    onChange(next)
  }

  function addQuestion() {
    const next = clone(questions)
    next.push({ question: '', answers: [{ text: '', points: 0 }] })
    onChange(next)
  }

  function deleteQuestion(qi) {
    if (!confirm(t.deleteConfirm)) return
    const next = clone(questions)
    next.splice(qi, 1)
    onChange(next)
  }

  return (
    <div className="editor">
      <div className="editor-head">
        <h2>{t.editorTitle}</h2>
        <span className="saved-note">✓ {t.saved}</span>
      </div>

      <div className="editor-io">
        <button onClick={exportJson}>⬇ {t.export}</button>
        <button onClick={copyJson}>{copied ? `✓ ${t.copied}` : `⧉ ${t.copyJson}`}</button>
        <button onClick={() => fileRef.current?.click()}>⬆ {t.import}</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={importJson}
          hidden
        />
      </div>

      {questions.length === 0 && <p className="empty">{t.noQuestions}</p>}

      {questions.map((q, qi) => (
        <div className="editor-card" key={qi}>
          <div className="editor-row">
            <label className="field grow">
              <span>
                {t.questionText} #{qi + 1}
              </span>
              <input
                value={q.question}
                onChange={(e) => updateQuestionText(qi, e.target.value)}
                placeholder={t.questionText}
              />
            </label>
            <button className="danger" onClick={() => deleteQuestion(qi)}>
              🗑 {t.deleteQuestion}
            </button>
          </div>

          {q.answers.map((a, ai) => (
            <div className="editor-row answer-row" key={ai}>
              <label className="field grow">
                <span>
                  {t.answerText} {ai + 1}
                </span>
                <input
                  value={a.text}
                  onChange={(e) => updateAnswer(qi, ai, { text: e.target.value })}
                  placeholder={t.answerText}
                />
              </label>
              <label className="field points-field">
                <span>{t.points}</span>
                <input
                  type="number"
                  min="0"
                  value={a.points}
                  onChange={(e) =>
                    updateAnswer(qi, ai, { points: Number(e.target.value) || 0 })
                  }
                />
              </label>
              <button
                className="icon-btn"
                onClick={() => deleteAnswer(qi, ai)}
                title={t.deleteQuestion}
              >
                ✕
              </button>
            </div>
          ))}

          <button className="ghost" onClick={() => addAnswer(qi)}>
            + {t.addAnswer}
          </button>
        </div>
      ))}

      <div className="editor-actions">
        <button onClick={addQuestion}>+ {t.addQuestion}</button>
        <button className="danger" onClick={onReset}>
          ↺ {t.resetDefaults}
        </button>
      </div>
    </div>
  )
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
