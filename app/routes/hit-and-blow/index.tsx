import type { MetaFunction, LinksFunction } from "@remix-run/node";
import stylesUrl from "./styles.css?url";
import GuessInput from "./components/GuessInput";
import AttemptHistory, { type Attempt } from "./components/AttemptHistory";
import GameResult from "./components/GameResult";
import WinMessage from "./components/WinMessage";
import { generateSecretNumber, calculateHitAndBlow } from "./utils/game";
import React, { useState, useEffect, useCallback } from 'react';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Hit & Blow Game" },
    { name: "description", content: "A fun game of Hit & Blow!" },
  ];
};

const NUMBER_OF_DIGITS = 4;

export default function HitAndBlowIndex() {
  const [secretNumber, setSecretNumber] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [latestHits, setLatestHits] = useState(0);
  const [latestBlows, setLatestBlows] = useState(0);
  const [isGuessed, setIsGuessed] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Used to reset the game

  const initializeGame = useCallback(() => {
    setSecretNumber(generateSecretNumber(NUMBER_OF_DIGITS));
    setAttempts([]);
    setLatestHits(0);
    setLatestBlows(0);
    setIsGuessed(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [gameKey, initializeGame]);

  const handleGuessSubmit = (guess: string) => {
    if (isGuessed || guess.length !== NUMBER_OF_DIGITS) return;

    const { hits, blows } = calculateHitAndBlow(secretNumber, guess);
    
    setLatestHits(hits);
    setLatestBlows(blows);
    setAttempts(prevAttempts => [...prevAttempts, { guess, hits, blows }]);

    if (hits === NUMBER_OF_DIGITS) {
      setIsGuessed(true);
    }
  };

  const handlePlayAgain = () => {
    setGameKey(prevKey => prevKey + 1);
  };

  return (
    <div className="game-container" key={gameKey}>
      <h1>Hit & Blow</h1>
      
      {/* Uncomment to display secret number for debugging: */}
      {/* <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9em' }}>Secret: {secretNumber}</p> */}

      {isGuessed ? (
        <WinMessage 
          attemptsCount={attempts.length} 
          secretNumber={secretNumber} 
          onPlayAgain={handlePlayAgain} 
        />
      ) : (
        <GuessInput 
          onSubmit={handleGuessSubmit} 
          disabled={isGuessed} 
          maxLength={NUMBER_OF_DIGITS} 
        />
      )}
      
      {attempts.length > 0 && !isGuessed && (
        <GameResult 
          hits={latestHits} 
          blows={latestBlows} 
          attemptsCount={attempts.length} 
        />
      )}
      
      <AttemptHistory attempts={attempts} />
    </div>
  );
}
