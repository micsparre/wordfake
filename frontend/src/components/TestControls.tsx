import { useState } from 'react';
import {
  skipToNextDay,
  getCurrentGameDate,
  clearTestDate,
  getTestDate,
  setTimeToBeforeMidnight,
  setTimeToAfterMidnight,
} from '../services/TestUtils';
import { resetStats } from '../services/GameStateService';
import { getTodaysPuzzle } from '../services/PuzzleService';

interface TestControlsProps {
  onDateChange: () => void;
}

function TestControls({ onDateChange }: TestControlsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const testDate = getTestDate();
  const currentDate = getCurrentGameDate();
  const currentPuzzle = getTodaysPuzzle();

  const handleSkipDay = () => {
    skipToNextDay();
    onDateChange();
  };

  const handleResetToToday = () => {
    clearTestDate();
    onDateChange();
  };

  const handleResetStats = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all stats? This cannot be undone.'
      )
    ) {
      resetStats();
      onDateChange();
    }
  };

  const handleBeforeMidnight = () => {
    setTimeToBeforeMidnight();
    onDateChange();
  };

  const handleAfterMidnight = () => {
    setTimeToAfterMidnight();
    onDateChange();
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-gray-700"
        >
          🧪 Test
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Test Controls</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        <div className="text-xs text-gray-600">
          <div>
            <strong>Current Date & Time:</strong>
          </div>
          <div>{currentDate.toLocaleString()}</div>
          <div className="mt-1">
            <strong>Puzzle ID:</strong> {currentPuzzle.id}
          </div>
          {testDate && (
            <div className="text-blue-600 mt-1">
              ⚠️ Using test date (not real date)
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="border-t pt-2">
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Day Controls:
            </div>
            <button
              onClick={handleSkipDay}
              className="w-full bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-600 mb-1"
            >
              Skip to Next Day
            </button>
          </div>

          <div className="border-t pt-2">
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Midnight Test:
            </div>
            <button
              onClick={handleBeforeMidnight}
              className="w-full bg-purple-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-purple-600 mb-1"
            >
              Set to 11:59:30 PM
            </button>
            <button
              onClick={handleAfterMidnight}
              className="w-full bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-purple-700 mb-1"
            >
              Set to 12:00:30 AM (Next Day)
            </button>
          </div>

          <div className="border-t pt-2">
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Reset:
            </div>
            <button
              onClick={handleResetToToday}
              className="w-full bg-green-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-600 mb-1"
            >
              Reset to Real Time
            </button>
            <button
              onClick={handleResetStats}
              className="w-full bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-red-600"
            >
              Reset All Stats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestControls;
