export default function TeamPanel({ t, team, pool, onAward, onChange, side }) {
  return (
    <aside className={`team team-${side}`}>
      <input
        className="team-name"
        value={team.name}
        onChange={(e) => onChange({ name: e.target.value })}
        aria-label={t.teamName}
      />
      <div className="team-score">{team.score}</div>
      <button className="award" onClick={onAward} disabled={pool === 0}>
        + {t.award} ({pool})
      </button>
      <div className="score-adjust">
        <button onClick={() => onChange({ score: Math.max(0, team.score - 5) })}>−5</button>
        <button onClick={() => onChange({ score: team.score + 5 })}>+5</button>
        <button onClick={() => onChange({ score: 0 })} title="Reset">
          0
        </button>
      </div>
    </aside>
  )
}
