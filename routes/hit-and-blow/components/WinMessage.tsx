import React from 'react';

interface WinMessageProps {
  attemptsCount: number;
  secretNumber: string;
  onPlayAgain: () => void;
}

export default function WinMessage({ attemptsCount, secretNumber, onPlayAgain }: WinMessageProps) {
  return (
    <div className="win-message">
      <h2>Congratulations!</h2>
      <p>
        You guessed the number <strong>{secretNumber}</strong> in {attemptsCount} attempts.
      </p>
      <button onClick={onPlayAgain}>
        Play Again?
      </button>
    </div>
  );
}
