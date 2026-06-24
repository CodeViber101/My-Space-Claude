// Purely decorative neon background: blurred color blobs + scattered icons.
export default function Decorations() {
  return (
    <div className="decor" aria-hidden="true">
      <span className="blob blob-1" />
      <span className="blob blob-2" />
      <span className="blob blob-3" />
      <span className="blob blob-4" />

      {/* lightning bolt (left) */}
      <svg className="ico ico-bolt" viewBox="0 0 24 24" width="54" height="54">
        <path
          d="M13 2L4 14h6l-1 8 9-12h-6z"
          fill="none"
          stroke="#36d6ff"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>

      {/* heart (right) */}
      <svg className="ico ico-heart" viewBox="0 0 24 24" width="48" height="48">
        <path
          d="M12 21s-7-4.5-9.5-9C1 9 2.5 5.5 6 5.5c2 0 3.2 1.2 4 2.3.8-1.1 2-2.3 4-2.3 3.5 0 5 3.5 3.5 6.5C19 16.5 12 21 12 21z"
          fill="none"
          stroke="#ff39c0"
          strokeWidth="1.5"
        />
      </svg>

      {/* small diamonds */}
      <svg className="ico ico-diamond ico-d1" viewBox="0 0 24 24" width="20" height="20">
        <path d="M12 2l8 10-8 10-8-10z" fill="#36d6ff" />
      </svg>
      <svg className="ico ico-diamond ico-d2" viewBox="0 0 24 24" width="16" height="16">
        <path d="M12 2l8 10-8 10-8-10z" fill="#ff8a3d" />
      </svg>
      <svg className="ico ico-diamond ico-d3" viewBox="0 0 24 24" width="14" height="14">
        <path d="M12 2l8 10-8 10-8-10z" fill="#ffd23f" />
      </svg>

      {/* dot grids */}
      <span className="dots dots-1" />
      <span className="dots dots-2" />
    </div>
  )
}
