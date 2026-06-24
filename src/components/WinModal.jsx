export default function WinModal({ t, title, subtitle, onNewGame, onClose }) {
  // A few static confetti pieces for a celebratory feel.
  const pieces = Array.from({ length: 24 })
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confetti" aria-hidden="true">
        {pieces.map((_, i) => (
          <span key={i} style={{ '--i': i }} />
        ))}
      </div>
      <div className="win-modal" onClick={(e) => e.stopPropagation()}>
        <div className="trophy">🏆</div>
        <p className="win-congrats">{t.congrats}</p>
        <h2 className="win-title">{title}</h2>
        {subtitle && <p className="win-subtitle">{subtitle}</p>}
        <div className="win-actions">
          <button className="primary" onClick={onNewGame}>
            ↺ {t.newGame}
          </button>
          <button onClick={onClose}>{t.close}</button>
        </div>
      </div>
    </div>
  )
}
