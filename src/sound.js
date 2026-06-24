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

// Build a buffer of white noise (used for the drum roll).
function noiseBuffer(ac, duration) {
  const len = Math.max(1, Math.floor(ac.sampleRate * duration))
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return buf
}

// A short snare-style drum roll that crescendos into a bright accent —
// played when an answer is revealed.
export function playDrumRoll() {
  const ac = getCtx()
  if (!ac) return
  const t0 = ac.currentTime
  const roll = 0.6

  // White-noise source shaped by a bandpass filter to sound like a snare.
  const src = ac.createBufferSource()
  src.buffer = noiseBuffer(ac, roll + 0.3)
  const band = ac.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1900
  band.Q.value = 0.7
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  src.connect(band).connect(g).connect(ac.destination)

  // Rapid taps that get louder toward the end (the "roll").
  const taps = 24
  for (let i = 0; i < taps; i++) {
    const frac = i / taps
    const t = t0 + frac * roll
    const amp = 0.03 + frac * 0.14
    g.gain.setValueAtTime(amp, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + (roll / taps) * 0.85)
  }
  src.start(t0)
  src.stop(t0 + roll + 0.1)

  // Bright two-note accent right as the roll finishes — the reveal "ta-da".
  tone({ freq: 880, start: roll, duration: 0.12, type: 'triangle', gain: 0.26 })
  tone({ freq: 1318, start: roll + 0.1, duration: 0.26, type: 'triangle', gain: 0.26 })
}

