// Stylized "Family 100" wordmark with sparkles.
export default function Logo() {
  return (
    <div className="logo" aria-label="Family 100">
      <svg className="logo-spark logo-spark-a" viewBox="0 0 24 24" width="22" height="22">
        <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" fill="#ffd23f" />
      </svg>
      <svg className="logo-spark logo-spark-b" viewBox="0 0 24 24" width="14" height="14">
        <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" fill="#ff5ed2" />
      </svg>
      <span className="logo-family">FAMILY</span>
      <span className="logo-100">100</span>
    </div>
  )
}
