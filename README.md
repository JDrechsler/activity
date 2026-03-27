# Activity — Bilingual Party Game

A digital version of the classic **Activity** board game, playable in your browser. Draw, explain, or act out words while others guess — with every card in **English and Spanish**, so you learn a new language while having fun.

**[Play now](https://jdrechsler.github.io/activity/)**

## How it works

1. **Add players** (2 or more) and form teams
2. **Pick your settings** — choose a vibe (Family / Party / Mixed), word categories, difficulty, target score, and timer duration
3. **Play!** Each turn, the game randomly assigns an action:
   - **Draw** — sketch it on paper
   - **Explain** — describe it with words only
   - **Act** — act it out, no talking
4. The active player sees a bilingual card (English + Spanish) and has to get their team to guess it before time runs out
5. First team to reach the target score wins

## Features

- Fully offline — no server, no account, no internet needed
- Mobile-first design — works great on phones, tablets, and desktop
- ~200 bilingual word cards across 8 categories
- 3 difficulty levels (Easy / Medium / Hard)
- 3 vibes: Family (all ages), Party (adults), Mixed (everything)
- Configurable timer (30s–120s) and target score (10–30)
- 2-player 1v1 mode or team mode for 3+ players
- Instant deploy via GitHub Pages

## Tech stack

- Vue 3 (Composition API + TypeScript)
- Tailwind CSS v4
- Vite
- Pinia for state management

## Development

```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build to dist/
npm run preview  # preview production build
```

## License

MIT
