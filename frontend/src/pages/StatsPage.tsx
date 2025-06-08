import { useEffect, useState } from 'react';
import { loadStats, loadGame } from '../services/GameStateService';
import type { GameStats } from '../services/GameStateService';

function StatsPage() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [gameInProgress, setGameInProgress] = useState(false);

  useEffect(() => {
    const currentStats = loadStats();
    setStats(currentStats);

    const currentGame = loadGame();
    setGameInProgress(
      currentGame !== null && currentGame.status === 'in-progress'
    );
  }, []);

  if (!stats) {
    return <div className="text-center">Loading stats...</div>;
  }

  const winPercentage =
    stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxHistogramValue = Math.max(...stats.guessHistogram);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Statistics
      </h2>

      {gameInProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-700 font-medium">
            Today's game still in progress
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-800">{stats.played}</div>
          <div className="text-sm text-gray-600">Played</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-800">
            {winPercentage}%
          </div>
          <div className="text-sm text-gray-600">Win %</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-800">
            {stats.currentStreak}
          </div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-gray-800">
            {stats.maxStreak}
          </div>
          <div className="text-sm text-gray-600">Max Streak</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Guess Distribution
        </h3>
        <div className="space-y-2">
          {stats.won > 0 ? (
            stats.guessHistogram.map((count, index) => {
              const guessNumber = index + 1;
              const percentage =
                maxHistogramValue > 0 ? (count / maxHistogramValue) * 100 : 0;

              return (
                <div key={guessNumber} className="flex items-center space-x-2">
                  <div className="text-sm font-medium text-gray-700 w-4">
                    {guessNumber}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded">
                    {count > 0 && (
                      <div
                        className="bg-blue-500 rounded h-6 flex items-center justify-end pr-2 transition-all duration-300"
                        style={{
                          width: `${Math.max(percentage, 15)}%`,
                        }}
                      >
                        <span className="text-xs font-medium text-white">
                          {count}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-4">
              No wins yet! Play the game to see your guess distribution.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
