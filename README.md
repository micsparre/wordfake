# Wordfake - Daily Word Game

A daily word game where players must identify the fake word among 5 options (4 real words + 1 fake word). Built as a front-end-only proof of concept using React, TypeScript, and Tailwind CSS.

## 🎮 Game Mechanics

- **Daily Puzzle**: Each day features a new set of 5 words
- **Objective**: Find the 1 fake word among 4 real words
- **Attempts**: You have 4 guesses maximum
- **Persistence**: Game state and statistics are saved locally
- **Algorithm**: Uses a stride-4 deterministic algorithm for word selection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wordfake
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

### Available Scripts

From the `frontend/` directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint and Prettier checks
- `npm run lint:fix` - Fix linting and formatting issues
- `npm run deploy:local` - Build and preview locally

## 🏗️ Architecture

### Project Structure

```
wordfake/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navigation.tsx
│   │   │   └── WordGrid.tsx
│   │   ├── pages/           # Route components
│   │   │   ├── GamePage.tsx
│   │   │   └── StatsPage.tsx
│   │   ├── services/        # Core game logic
│   │   │   ├── PuzzleService.ts    # Word selection algorithm
│   │   │   ├── GameStateService.ts # Local storage management
│   │   │   └── WordLoader.ts       # Word list loading
│   │   └── assets/          # Static assets
│   │       ├── real.txt     # Real words list
│   │       └── fake.txt     # Fake words list
│   ├── dist/                # Built application
│   └── package.json
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml          # Deployment workflow
└── README.md
```

### Key Services

#### PuzzleService
- Implements the stride-4 word selection algorithm
- Provides deterministic daily puzzles based on date
- Uses seeded random for reproducible word shuffling

#### GameStateService
- Manages localStorage persistence for game state and statistics
- Tracks daily game progress, win/loss streaks, and guess distribution
- Handles game completion and stat recording

#### WordLoader
- Loads word lists from static text files using Vite's `?raw` import
- Processes words to uppercase and filters empty lines

## 🎯 Game Logic

### Puzzle Generation Algorithm

```typescript
zeroDate = 2025-06-15
offset = daysBetween(zeroDate, todayUTC)
realIdx = (offset * 4) % realWords.length  // 4 words per day
fakeIdx = offset % fakeWords.length        // 1 fake word per day
words = [real[realIdx...realIdx+3], fake[fakeIdx]]
shuffle(words)  // Deterministic Fisher-Yates using date as seed
```

### Local Storage Schema

**Daily Game State** (`wordfake.dailyGame.v1`):
```typescript
{
  puzzleId: string;      // YYYY-MM-DD format
  guesses: string[];     // Array of guessed words
  status: 'in-progress' | 'complete';
  finishedAt?: Date;     // Completion timestamp
}
```

**Statistics** (`wordfake.stats.v1`):
```typescript
{
  played: number;           // Total games played
  won: number;             // Total games won
  currentStreak: number;   // Current win streak
  maxStreak: number;       // Best win streak
  guessHistogram: [number, number, number, number]; // Wins by guess count
}
```

## 🚀 Deployment

### GitHub Pages

The project is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** triggers the deployment workflow
2. **GitHub Actions** builds the project and deploys to `gh-pages` branch
3. **Site URL**: `https://[username].github.io/wordfake/`

### Manual Deployment

```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🛠️ Development

### Code Quality

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks for code quality
- **TypeScript**: Type safety and better developer experience

### Pre-commit Hooks

The project uses Husky to run linting and formatting checks before commits:

```bash
# Runs automatically on git commit
cd frontend && npx lint-staged
```

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Package Manager**: npm
- **Deployment**: GitHub Pages

## 📱 Features

### Core Features ✅
- Daily word puzzles with deterministic generation
- Local game state persistence
- Statistics tracking with win streaks and guess distribution
- Responsive design with Tailwind CSS
- Navigation between game and stats pages
- Visual feedback for correct/incorrect guesses

### Future Enhancements (Not in POC)
- E2E testing with Cypress
- Server-side validation
- User accounts and cloud sync
- Social sharing features
- Sound effects and animations
- Accessibility improvements
- Internationalization

## 🔧 Configuration

### Word Lists

- **Real words**: `src/assets/real.txt` (one word per line)
- **Fake words**: `src/assets/fake.txt` (one word per line)
- Words are automatically converted to uppercase
- Lists can be updated by modifying the text files

### Zero Date

The puzzle generation starts from a configurable zero date:
```typescript
const ZERO_DATE = new Date('2025-06-07T00:00:00.000Z');
```

This ensures consistent daily puzzles across all users.

## 📄 License

This project is a proof of concept. See repository for license details.

## 🤝 Contributing

This is a POC project. For production use, consider:
- Adding comprehensive test coverage
- Implementing server-side word validation
- Adding accessibility features
- Setting up continuous integration
- Adding monitoring and analytics