import { defaultQuestions } from './i18n.js'

// localStorage-backed question store, keyed per language.
const KEY = (lang) => `family100.questions.${lang}`

export function loadQuestions(lang) {
  try {
    const raw = localStorage.getItem(KEY(lang))
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // ignore corrupt storage and fall back to defaults
  }
  return clone(defaultQuestions[lang])
}

export function saveQuestions(lang, questions) {
  try {
    localStorage.setItem(KEY(lang), JSON.stringify(questions))
  } catch {
    // storage may be unavailable (private mode); state still lives in React
  }
}

export function resetQuestions(lang) {
  try {
    localStorage.removeItem(KEY(lang))
  } catch {
    // ignore
  }
  return clone(defaultQuestions[lang])
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
