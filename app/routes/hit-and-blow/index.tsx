import type { MetaFunction, LinksFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import stylesUrl from "./styles.css?url";
import GuessInput from "./components/GuessInput";
import AttemptHistory, { type Attempt } from "./components/AttemptHistory";
import GameResult from "./components/GameResult";
import WinMessage from "./components/WinMessage";
import { generateSecretNumber, calculateHitAndBlow } from "./utils/game";
import { createPlayHistory } from "~/services/playHistory.server";
import { requireUserId } from "~/services/auth.server"; // Corrected import path
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const attempts = Number(formData.get("attempts"));

  if (isNaN(attempts) || attempts <= 0) {
    return json({ error: "Invalid attempt count" }, { status: 400 });
  }

  try {
    await createPlayHistory(userId, attempts);
    return json({ success: true });
  } catch (error) {
    console.error("Failed to save play history:", error);
    return json({ error: "Failed to save play history" }, { status: 500 });
  }
};

export default function HitAndBlowIndex() {
  const fetcher = useFetcher();
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
      // Call action to save play history
      // We need to pass the number of attempts.
      // The attempts array has just been updated, so its length is the current number of attempts.
      const currentAttempts = attempts.length + 1; // +1 because state update is pending
      fetcher.submit(
        { attempts: currentAttempts.toString() },
        { method: "post" }
      );
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
