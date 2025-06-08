import { loadRealWords, loadFakeWords } from './WordLoader';

export interface Puzzle {
  id: string;
  words: string[];
  fakeWordIndex: number;
  date: Date;
}

const ZERO_DATE = new Date('2025-06-08T00:00:00.000Z');

function daysBetween(startDate: Date, endDate: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );
  return Math.floor((end.getTime() - start.getTime()) / msPerDay);
}

function seededRandom(seed: number): () => number {
  let x = seed;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

function deterministicShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getPuzzleForDate(date: Date): Puzzle {
  try {
    const realWords = loadRealWords();
    const fakeWords = loadFakeWords();

    if (realWords.length === 0 || fakeWords.length === 0) {
      console.error('Word lists are empty:', { realWords: realWords.length, fakeWords: fakeWords.length });
      throw new Error('Word lists not loaded properly');
    }

    const offset = daysBetween(ZERO_DATE, date);

    // Calculate indices using stride-4 algorithm
    const realIdx = (offset * 4) % realWords.length;
    const fakeIdx = offset % fakeWords.length;

    // Get 4 real words starting from realIdx
    const selectedRealWords: string[] = [];
    for (let i = 0; i < 4; i++) {
      selectedRealWords.push(realWords[(realIdx + i) % realWords.length]);
    }

    // Get 1 fake word
    const fakeWord = fakeWords[fakeIdx];

    // Combine all words
    const allWords = [...selectedRealWords, fakeWord];

    // Deterministic shuffle using date as seed for reproducibility
    const seed =
      date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
    const shuffledWords = deterministicShuffle(allWords, seed);

    // Find the index of the fake word after shuffling
    const fakeWordIndex = shuffledWords.indexOf(fakeWord);

    const puzzleId = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
      id: puzzleId,
      words: shuffledWords,
      fakeWordIndex,
      date: new Date(date),
    };
  } catch (error) {
    console.error('Failed to generate puzzle:', error);
    throw error;
  }
}

export function getTodaysPuzzle(): Puzzle {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  return getPuzzleForDate(today);
}
