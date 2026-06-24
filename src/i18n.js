import { questions as questionsEn } from './data/questions.en.js'
import { questions as questionsId } from './data/questions.id.js'

export const defaultQuestions = {
  en: questionsEn,
  id: questionsId,
}

// UI label translations.
export const strings = {
  en: {
    title: 'Family 100',
    host: 'Host',
    solo: 'Single player',
    pool: 'Pool',
    strike: 'Strike',
    revealAll: 'Reveal all',
    resetRound: 'Reset round',
    award: 'Award pool',
    teamName: 'Team name',
    edit: 'Edit questions',
    done: 'Done',
    sound: 'Sound',
    language: 'Language',
    mode: 'Mode',
    guessPlaceholder: 'Type your guess and press Enter…',
    guess: 'Guess',
    soloScore: 'Score',
    roundOver: '3 strikes — round over! Reveal the rest or start a new question.',
    nextQuestion: 'Next question',
    hintHost:
      'Host tool · Click an answer slot to reveal it · Use “Strike” for wrong guesses · Award the pool to the team that wins the round.',
    hintSolo:
      'Single player · Type a guess and press Enter · Correct answers reveal automatically · A wrong guess is a strike (3 max).',
    // Editor
    editorTitle: 'Question Editor',
    addQuestion: 'Add question',
    deleteQuestion: 'Delete question',
    addAnswer: 'Add answer',
    questionText: 'Question',
    answerText: 'Answer',
    points: 'Points',
    resetDefaults: 'Reset to defaults',
    resetConfirm: 'Reset all questions for this language to the built-in defaults?',
    deleteConfirm: 'Delete this question?',
    saved: 'Saved in your browser',
    noQuestions: 'No questions yet. Add one to get started.',
  },
  id: {
    title: 'Family 100',
    host: 'Pembawa acara',
    solo: 'Pemain tunggal',
    pool: 'Poin',
    strike: 'Salah',
    revealAll: 'Buka semua',
    resetRound: 'Ulang ronde',
    award: 'Beri poin',
    teamName: 'Nama tim',
    edit: 'Edit soal',
    done: 'Selesai',
    sound: 'Suara',
    language: 'Bahasa',
    mode: 'Mode',
    guessPlaceholder: 'Ketik jawabanmu lalu tekan Enter…',
    guess: 'Jawab',
    soloScore: 'Skor',
    roundOver: '3 kali salah — ronde selesai! Buka sisanya atau ganti soal.',
    nextQuestion: 'Soal berikutnya',
    hintHost:
      'Mode pembawa acara · Klik kotak jawaban untuk membukanya · Gunakan “Salah” untuk jawaban keliru · Berikan poin ke tim pemenang ronde.',
    hintSolo:
      'Pemain tunggal · Ketik jawaban lalu tekan Enter · Jawaban benar terbuka otomatis · Jawaban salah dihitung sebagai strike (maks 3).',
    // Editor
    editorTitle: 'Editor Soal',
    addQuestion: 'Tambah soal',
    deleteQuestion: 'Hapus soal',
    addAnswer: 'Tambah jawaban',
    questionText: 'Soal',
    answerText: 'Jawaban',
    points: 'Poin',
    resetDefaults: 'Kembalikan ke bawaan',
    resetConfirm: 'Kembalikan semua soal bahasa ini ke bawaan?',
    deleteConfirm: 'Hapus soal ini?',
    saved: 'Tersimpan di browser-mu',
    noQuestions: 'Belum ada soal. Tambahkan untuk memulai.',
  },
}
