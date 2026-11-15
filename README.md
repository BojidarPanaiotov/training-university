# Тренировъчен университет

A single-page training site for calisthenics, yoga, running, mobility, and HIIT. Visitors browse programs, read lessons, take a short quiz, and see a score. The interface and course copy are Bulgarian.

## Scripts

```bash
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Typecheck with `tsc`, then build for production |
| `npm run preview` | Serve the production build locally |

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/courses/:slug` | Program lessons |
| `/courses/:slug/exercise` | Quiz |
| `/courses/:slug/results` | Score and answer review |
| `/about` | About page |

Program slugs are stable identifiers (`calisthenics-foundations`, `power-yoga-flow`, `zero-to-5k`, `mobility-stretching`, `hiit-strength`). Quiz results are passed in router state, so opening the results URL directly sends the visitor back to the exercise.

## Copy

Visible text lives in JSON under `src/locales/bg/`:

| File | Contents |
| --- | --- |
| `ui.json` | Navigation, landing page, course chrome, quiz, and results |
| `courses.json` | Program titles, lessons, questions, and testimonials |
| `athlete.json` | Labels for the animated athlete |

Strings with `{placeholders}` are filled by `src/locales/format.ts`. Ratings, hours, images, and gradients stay in `src/data/courses.ts` and are merged with the course copy by slug.

## Stack

React 19, TypeScript, Vite, React Router, and Tailwind CSS 4.
