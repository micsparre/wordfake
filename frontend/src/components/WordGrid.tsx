interface WordGridProps {
  words: string[];
  guesses: string[];
  onWordClick: (word: string) => void;
  disabled: boolean;
  fakeWordIndex: number | null;
}

function WordGrid({
  words,
  guesses,
  onWordClick,
  disabled,
  fakeWordIndex,
}: WordGridProps) {
  const getWordStatus = (word: string, index: number) => {
    if (guesses.includes(word)) {
      return fakeWordIndex === index ? 'correct' : 'incorrect';
    }
    return 'unguessed';
  };

  const getWordStyles = (word: string, index: number) => {
    const status = getWordStatus(word, index);

    const baseStyles =
      'w-full p-4 rounded-xl text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

    if (disabled) {
      if (status === 'correct') {
        return `${baseStyles} bg-green-500 text-white`;
      } else if (status === 'incorrect') {
        return `${baseStyles} bg-red-500 text-white`;
      } else if (fakeWordIndex === index) {
        return `${baseStyles} bg-green-500 text-white`;
      } else {
        return `${baseStyles} bg-gray-300 text-gray-700`;
      }
    }

    if (status === 'correct') {
      return `${baseStyles} bg-green-500 text-white`;
    } else if (status === 'incorrect') {
      return `${baseStyles} bg-red-500 text-white`;
    } else {
      return `${baseStyles} bg-slate-100 text-gray-800 hover:bg-slate-200 shadow-sm active:transform active:scale-95`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, word: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!disabled && !guesses.includes(word)) {
        onWordClick(word);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {words.map((word, index) => {
        const isGuessed = guesses.includes(word);
        const isClickable = !disabled && !isGuessed;

        return (
          <button
            key={`${word}-${index}`}
            onClick={() => isClickable && onWordClick(word)}
            onKeyDown={(e) => handleKeyDown(e, word)}
            disabled={!isClickable}
            className={getWordStyles(word, index)}
            tabIndex={isClickable ? 0 : -1}
            aria-label={`Word: ${word}${isGuessed ? ', already guessed' : ''}`}
          >
            {word.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export default WordGrid;
