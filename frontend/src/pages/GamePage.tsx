import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodaysPuzzle } from '../services/PuzzleService';
import {
  loadGame,
  initializeGame,
  addGuess,
  completeGame,
} from '../services/GameStateService';
import type { Puzzle } from '../services/PuzzleService';
import type { DailyGameState } from '../services/GameStateService';
import WordGrid from '../components/WordGrid';
import TestControls from '../components/TestControls';

function GamePage() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [gameState, setGameState] = useState<DailyGameState | null>(null);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const todaysPuzzle = getTodaysPuzzle();
      setPuzzle(todaysPuzzle);

      let currentGame = loadGame();

      if (!currentGame || currentGame.puzzleId !== todaysPuzzle.id) {
        currentGame = initializeGame(todaysPuzzle.id);
      }

      setGameState(currentGame);

      if (currentGame.status === 'complete') {
        const isWin = currentGame.guesses.includes(
          todaysPuzzle.words[todaysPuzzle.fakeWordIndex]
        );
        setGameResult(isWin ? 'win' : 'loss');
      }
    } catch (err) {
      console.error('Error loading game:', err);
      setError(err instanceof Error ? err.message : 'Failed to load game');
    }
  }, []);

  const handleDateChange = () => {
    // Reload the game with the new date
    try {
      const todaysPuzzle = getTodaysPuzzle();
      setPuzzle(todaysPuzzle);

      let currentGame = loadGame();

      if (!currentGame || currentGame.puzzleId !== todaysPuzzle.id) {
        currentGame = initializeGame(todaysPuzzle.id);
      }

      setGameState(currentGame);
      setGameResult(null);

      if (currentGame.status === 'complete') {
        const isWin = currentGame.guesses.includes(
          todaysPuzzle.words[todaysPuzzle.fakeWordIndex]
        );
        setGameResult(isWin ? 'win' : 'loss');
      }
    } catch (err) {
      console.error('Error loading game after date change:', err);
      setError(err instanceof Error ? err.message : 'Failed to load game');
    }
  };

  const handleWordClick = (word: string) => {
    if (!puzzle || !gameState || gameState.status === 'complete') {
      return;
    }

    const updatedGame = addGuess(puzzle.id, word);
    if (!updatedGame) return;

    const isCorrectGuess = word === puzzle.words[puzzle.fakeWordIndex];
    const isGameOver = isCorrectGuess || updatedGame.guesses.length >= 4;

    if (isGameOver) {
      const finalGame = completeGame(puzzle.id, isCorrectGuess);
      if (finalGame) {
        setGameState(finalGame);
        setGameResult(isCorrectGuess ? 'win' : 'loss');
      }
    } else {
      setGameState(updatedGame);
    }
  };

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
        <p className="text-gray-600">
          Please refresh the page or check the console for more details.
        </p>
      </div>
    );
  }

  if (!puzzle || !gameState) {
    return <div className="text-center">Loading today's puzzle...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Find the Fake Word
        </h2>
        <p className="text-gray-600">
          4 real words, 1 fake word. You have 4 guesses.
        </p>
      </div>

      <WordGrid
        words={puzzle.words}
        guesses={gameState.guesses}
        onWordClick={handleWordClick}
        disabled={gameState.status === 'complete'}
        fakeWordIndex={
          gameState.status === 'complete' ? puzzle.fakeWordIndex : null
        }
      />

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Guesses: {gameState.guesses.length} / 4
        </p>

        {gameResult && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                gameResult === 'win'
                  ? 'bg-green-100 border border-green-200'
                  : 'bg-red-100 border border-red-200'
              }`}
            >
              {gameResult === 'win' ? (
                <div>
                  <p className="font-semibold text-green-800 mb-1">
                    Congratulations!
                  </p>
                  <p className="text-green-700">
                    You found the fake word "
                    {puzzle.words[puzzle.fakeWordIndex]}" in{' '}
                    {gameState.guesses.length} guess
                    {gameState.guesses.length !== 1 ? 'es' : ''}!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-red-800 mb-1">Game Over</p>
                  <p className="text-red-700">
                    The fake word was "{puzzle.words[puzzle.fakeWordIndex]}".
                    Better luck tomorrow!
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/stats')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              View Stats
            </button>
          </div>
        )}
      </div>

      {import.meta.env.DEV && <TestControls onDateChange={handleDateChange} />}
    </div>
  );
}

export default GamePage;
