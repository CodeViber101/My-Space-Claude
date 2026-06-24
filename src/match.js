// Fuzzy answer matching for single-player mode.

function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9\s]/g, ' ') // punctuation -> space
    .replace(/\s+/g, ' ')
    .trim()
}

// Levenshtein distance, capped early for performance.
function distance(a, b) {
  const m = a.length
  const n = b.length
  if (Math.abs(m - n) > 2) return 99
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

function closeEnough(guess, candidate) {
  if (!guess || !candidate) return false
  if (guess === candidate) return true
  // Allow the guess to match a meaningful word inside the answer (>=4 chars).
  if (candidate.includes(guess) && guess.length >= 4) return true
  if (guess.includes(candidate) && candidate.length >= 4) return true
  // Allow small typos on longer words.
  const tol = candidate.length >= 6 ? 2 : candidate.length >= 4 ? 1 : 0
  return distance(guess, candidate) <= tol
}

// Returns the index of the matching answer, or -1.
// Answers may contain slash-separated alternatives, e.g. "Stove / Oven".
export function matchAnswer(guessRaw, answers, alreadyRevealed) {
  const guess = normalize(guessRaw)
  if (!guess) return -1
  for (let i = 0; i < answers.length; i++) {
    if (alreadyRevealed[i]) continue
    const variants = answers[i].text.split('/').map((v) => normalize(v))
    for (const v of variants) {
      if (closeEnough(guess, v)) return i
      // Also check word-by-word so "stove" matches "stove oven".
      for (const word of v.split(' ')) {
        if (word.length >= 4 && closeEnough(guess, word)) return i
      }
    }
  }
  return -1
}
