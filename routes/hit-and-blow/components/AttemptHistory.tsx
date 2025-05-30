import React from 'react';

export interface Attempt {
  guess: string;
  hits: number;
  blows: number;
}

interface AttemptHistoryProps {
  attempts: Attempt[];
}

export default function AttemptHistory({ attempts }: AttemptHistoryProps) {
  if (attempts.length === 0) {
    return <div>No attempts yet.</div>;
  }

  return (
    <div className="attempt-history">
      <h2>Attempt History</h2>
      <ul>
        {attempts.map((attempt, index) => (
          <li key={index} className="attempt-item">
            <span>Guess #{index + 1}: <span className="guess-value">{attempt.guess}</span></span>
            <span>
              Hits: <span className="hits-value">{attempt.hits}</span>, 
              Blows: <span className="blows-value">{attempt.blows}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
