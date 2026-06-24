# Family 100

A React mini-game of **Family 100** (the Indonesian version of **Family Feud**).
It has two modes, English + Indonesian content, sound effects, and a built-in
question editor.

## Modes

- **Host** — the host runs the board: click answer slots to reveal them, add
  strikes for wrong guesses, apply 1× / 2× / 3× multipliers, and award the
  round's point pool to one of two teams.
- **Single player** — type a guess and press Enter. Correct guesses reveal
  automatically (with fuzzy matching for typos and alternative wordings); a
  wrong guess is a strike (3 max).

## Features

- 🌐 **Language toggle** — English (`EN`) and Bahasa Indonesia (`ID`), both UI
  and survey content.
- 🔊 **Sound effects** — a "ding" for correct answers and a buzzer for strikes
  (Web Audio, no files). Mute with the speaker button.
- ✎ **Question editor** — add / edit / delete questions and answers in the
  browser; changes are saved to `localStorage` per language, with a
  reset-to-defaults option.

## How to play (host)

1. Pick a question from the dropdown at the top (or use ‹ / › to move between rounds).
2. Read the survey question aloud. Players shout out answers.
3. **Click an answer slot** to reveal it when a player guesses correctly. The
   revealed points add to the round **Pool**.
4. **Click “✖ Strike”** for a wrong answer (up to 3 strikes per round).
5. Use **Single / Double / Triple (1× / 2× / 3×)** to multiply the round value,
   just like the classic fast-money rounds.
6. **“+ Award pool”** under a team adds the current pool to that team's score.
7. **Reset round** clears reveals and strikes; pick a new question to start fresh.

Extra controls:
- **Reveal all** — show every answer (e.g. at the end of a round).
- Edit team names inline; use **−5 / +5 / 0** to adjust scores manually.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

To build a static version:

```bash
npm run build
npm run preview
```

## Add your own questions

The easiest way is the in-app **✎ Edit questions** button — changes save to your
browser automatically. Use **↺ Reset to defaults** to restore the built-in set.

To change the built-in defaults in code, edit `src/data/questions.en.js` or
`src/data/questions.id.js`. Each question is an object with a `question` string
and an `answers` array, ranked from most to least popular. Points roughly add up
to 100 (the "100 people surveyed").

```js
{
  question: 'Name something you find in a kitchen.',
  answers: [
    { text: 'Refrigerator', points: 30 },
    { text: 'Stove / Oven', points: 24 }, // " / " marks accepted alternatives in solo mode
    // ...
  ],
}
```

## Tech

- React 18 + Vite
- No backend — everything (including your custom questions) runs in the browser.
