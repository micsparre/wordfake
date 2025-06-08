Iteration‑0 Backlog (Static‑Site POC)

Convention
Each heading = single GitHub Issue.  Copy/paste into the repo or use the GitHub Import API.  Each issue block already includes an Acceptance Criteria section you can convert to task‑list checkboxes if desired.

⸻

1 · Repo Bootstrap (Vite + TypeScript)

Goal: Create the monorepo scaffold for the front‑end‑only implementation.

Tasks
	•	Init npm workspace using pnpm create vite@latest wordfake --template react-ts.
	•	Add Prettier + ESLint with TypeScript plugin.
	•	Add Husky pre‑commit hook running pnpm lint.


⸻

2 · Word Lists & Loader Script

Goal: Ship real.txt and fake.txt and make them importable as raw text.

Tasks
	•	Place both files under src/assets/ (one word per line, uppercase).
	•	Add Vite ?raw import to WordLoader.ts.
	•	Parse into string arrays at build time.


⸻

3 · PuzzleService (Stride‑4 Selector)

Goal: Deterministically pick today’s 4 real + 1 fake word.

Tasks
	•	Implement getPuzzleForDate(date: Date): Puzzle.
	•	Formula: realIdx = (offset * 4) % realLen, fakeIdx = offset % fakeLen.
	•	Perform Fisher‑Yates shuffle before returning.


⸻

4 · GameStateService (localStorage v1)

Goal: Persist in‑progress and completed game state + global stats.

Tasks
	•	Key wordfake.dailyGame.v1 with fields puzzleId, guesses, status, finishedAt.
	•	Key wordfake.stats.v1 aggregating played/won/streak/histogram.
	•	Functions: loadGame(), saveGame(), recordWin(), recordLoss().


⸻

5 · Routing & Navigation

Goal: Enable / and /stats routes accessible anytime.

Tasks
	•	Add React Router v6.
	•	Top nav with links “Game” and “Stats” (hidden on mobile via hamburger icon optional).
	•	Game route shows read‑only grid if today already completed.


⸻

6 · StatsPage Component

Goal: Visualize overall stats and guess histogram.

Tasks
	•	Render total played, win %, current & max streak.
	•	Horizontal bar histogram (CSS flex) for guess distribution 1‑4.
	•	Note: “Today’s game still in progress” banner if dailyGame.status!=='complete'.


⸻

7 · Game UI (Core Interaction)

Goal: Render 5 word buttons, handle up‑to‑4 guesses, end banner.

Tasks
	•	WordGrid component (buttons styled via Tailwind).
	•	On click or Enter‑key activation call handleGuess(word).
	•	After win/loss, disable buttons and show result banner.
	•	“View Stats” button navigates to /stats.


⸻

8 · Styling with Tailwind CSS

Goal: Apply minimal yet clean styling.

Tasks
	•	Set up tailwind.config.cjs with standard content paths.
	•	Global font‑family sans‑serif; dark‑mode optional.
	•	Buttons: rounded-xl p-4 shadow-sm bg-slate-100 hover:bg-slate-200.


⸻

9 · E2E Tests (Cypress)

Goal: Validate game flow and state persistence.

Tasks
	•	Scenario 1: Fresh visit → win game in 2 guesses → Stats page shows histogram bucket 2++.
	•	Scenario 2: Start game → reload page → continue → lose.
	•	Scenario 3: Mid‑game visit /stats then return to /.


⸻

10 · Static Deploy Script

Goal: One‑command publish to Vercel (or Netlify).

Tasks
	•	Add vercel.json or netlify config for SPA routing.
	•	GitHub Action to run pnpm build and deploy on main merge.


⸻

11 · README (Developer Guide)

Goal: Document setup, test, and deploy workflow.

