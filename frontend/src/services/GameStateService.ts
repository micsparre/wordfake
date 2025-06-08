export interface DailyGameState {
  puzzleId: string;
  guesses: string[];
  status: 'in-progress' | 'complete';
  finishedAt?: Date;
}

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guessHistogram: [number, number, number, number]; // Index 0-3 for guesses 1-4
}

const DAILY_GAME_KEY = 'wordfake.dailyGame.v1';
const STATS_KEY = 'wordfake.stats.v1';

export function loadGame(): DailyGameState | null {
  try {
    const stored = localStorage.getItem(DAILY_GAME_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      finishedAt: parsed.finishedAt ? new Date(parsed.finishedAt) : undefined,
    };
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function saveGame(gameState: DailyGameState): void {
  try {
    localStorage.setItem(DAILY_GAME_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadStats(): GameStats {
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) {
      return {
        played: 0,
        won: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessHistogram: [0, 0, 0, 0],
      };
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load stats:', error);
    return {
      played: 0,
      won: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessHistogram: [0, 0, 0, 0],
    };
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

export function recordWin(guessCount: number): void {
  const stats = loadStats();

  stats.played += 1;
  stats.won += 1;
  stats.currentStreak += 1;
  stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);

  // Record in histogram (guessCount 1-4 maps to index 0-3)
  if (guessCount >= 1 && guessCount <= 4) {
    stats.guessHistogram[guessCount - 1] += 1;
  }

  saveStats(stats);
}

export function recordLoss(): void {
  const stats = loadStats();

  stats.played += 1;
  stats.currentStreak = 0; // Reset streak on loss

  saveStats(stats);
}

export function initializeGame(puzzleId: string): DailyGameState {
  const gameState: DailyGameState = {
    puzzleId,
    guesses: [],
    status: 'in-progress',
  };

  saveGame(gameState);
  return gameState;
}

export function addGuess(
  puzzleId: string,
  word: string
): DailyGameState | null {
  const currentGame = loadGame();

  if (!currentGame || currentGame.puzzleId !== puzzleId) {
    console.error('No matching game state found');
    return null;
  }

  if (currentGame.status === 'complete') {
    console.warn('Game is already complete');
    return currentGame;
  }

  const updatedGame: DailyGameState = {
    ...currentGame,
    guesses: [...currentGame.guesses, word],
  };

  saveGame(updatedGame);
  return updatedGame;
}

export function completeGame(
  puzzleId: string,
  isWin: boolean
): DailyGameState | null {
  const currentGame = loadGame();

  if (!currentGame || currentGame.puzzleId !== puzzleId) {
    console.error('No matching game state found');
    return null;
  }

  const updatedGame: DailyGameState = {
    ...currentGame,
    status: 'complete',
    finishedAt: new Date(),
  };

  // Update stats
  if (isWin) {
    recordWin(currentGame.guesses.length); // The final guess is already in the array
  } else {
    recordLoss();
  }

  saveGame(updatedGame);
  return updatedGame;
}

export function resetStats(): void {
  try {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(DAILY_GAME_KEY);
    console.log('Stats and game data reset');
  } catch (error) {
    console.error('Failed to reset stats:', error);
  }
}
