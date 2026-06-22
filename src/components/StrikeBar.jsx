export default function StrikeBar({ strikes, flash }) {
  return (
    <div className={`strikebar ${flash ? 'flash' : ''}`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`strike ${i < strikes ? 'on' : ''}`}>
          ✖
        </span>
      ))}
    </div>
  )
}
