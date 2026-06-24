// Tiny Web Audio sound engine — no audio files needed.
let ctx = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  // Browsers suspend audio until a user gesture; resume on demand.
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone({ freq, start = 0, duration = 0.18, type = 'sine', gain = 0.2, slideTo }) {
  const ac = getCtx()
  if (!ac) return
  const t0 = ac.currentTime + start
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.linearRampToValueAtTime(slideTo, t0 + duration)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(g).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

// Bright two-note "ding" for a correct answer.
export function playDing() {
  tone({ freq: 880, duration: 0.12, type: 'triangle', gain: 0.25 })
  tone({ freq: 1318, start: 0.1, duration: 0.22, type: 'triangle', gain: 0.25 })
}

// Low buzzer for a strike / wrong answer.
export function playBuzzer() {
  tone({ freq: 200, duration: 0.45, type: 'sawtooth', gain: 0.22, slideTo: 110 })
}

// Quick reveal blip used when the host opens a slot manually.
export function playReveal() {
  tone({ freq: 660, duration: 0.1, type: 'square', gain: 0.14 })
}
