export default function Board({ answers, revealed, onReveal, onHide, interactive = true }) {
  // Lay answers out in two columns like the classic board.
  const half = Math.ceil(answers.length / 2)
  const columns = [answers.slice(0, half), answers.slice(half)]

  return (
    <div className="board">
      {columns.map((col, c) => (
        <div className="board-col" key={c}>
          {col.map((answer, j) => {
            const i = c * half + j
            const isOpen = !!revealed[i]
            const clickable = interactive
            return (
              <button
                key={i}
                className={`slot ${isOpen ? 'open' : ''} ${clickable ? '' : 'locked'}`}
                onClick={() => {
                  if (!clickable) return
                  isOpen ? onHide(i) : onReveal(i)
                }}
                disabled={!clickable && !isOpen}
                title={clickable ? (isOpen ? 'Click to hide' : 'Click to reveal') : ''}
              >
                <span className={`slot-num c${i % 6}`}>{i + 1}</span>
                {isOpen ? (
                  <>
                    <span className="slot-text">{answer.text}</span>
                    <span className="slot-points">{answer.points}</span>
                  </>
                ) : (
                  <span className="slot-dots" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
