import React from 'react';

interface GameResultProps {
  hits: number;
  blows: number;
  attemptsCount: number; // This might be redundant if using AttemptHistory, but included as per spec
}

export default function GameResult({ hits, blows, attemptsCount }: GameResultProps) {
  return (
    <div className="game-result">
      <h2>Current Result</h2>
      <p>Hits: <span className="hits-value">{hits}</span></p>
      <p>Blows: <span className="blows-value">{blows}</span></p>
      {/* <p>Attempts: {attemptsCount}</p> */}
      {/* Displaying attempts count here might be duplicative if AttemptHistory is also shown with its list length.
          Keeping it simple for now as per spec, but consider how it integrates with AttemptHistory. */}
    </div>
  );
}
