/**
 * Generates a secret number string with unique random digits.
 * @param digits The number of digits for the secret number.
 * @returns A string of unique random digits.
 */
export function generateSecretNumber(digits: number): string {
  if (digits <= 0 || digits > 10) {
    throw new Error("Number of digits must be between 1 and 10.");
  }

  const availableDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let secretNumber = "";

  for (let i = 0; i < digits; i++) {
    const randomIndex = Math.floor(Math.random() * availableDigits.length);
    secretNumber += availableDigits.splice(randomIndex, 1)[0];
  }

  return secretNumber;
}

/**
 * Calculates the number of "hits" and "blows" for a guess in the Hit & Blow game.
 *
 * A "hit" occurs when a digit in the guess is correct and in the correct position.
 * A "blow" occurs when a digit in the guess is correct but in the wrong position.
 *
 * Important: A digit that scores a "hit" cannot also score a "blow".
 *
 * @param secret The secret number string.
 * @param guess The guessed number string.
 * @returns An object with the count of hits and blows.
 */
export function calculateHitAndBlow(secret: string, guess: string): { hits: number; blows: number } {
  if (secret.length !== guess.length) {
    throw new Error("Secret and guess must have the same length.");
  }

  let hits = 0;
  let blows = 0;

  const secretDigits = secret.split('');
  const guessDigits = guess.split('');

  // To keep track of digits used for hits or blows to avoid double counting.
  const secretUsed = new Array(secretDigits.length).fill(false);
  const guessUsed = new Array(guessDigits.length).fill(false);

  // First, calculate hits
  for (let i = 0; i < secretDigits.length; i++) {
    if (secretDigits[i] === guessDigits[i]) {
      hits++;
      secretUsed[i] = true;
      guessUsed[i] = true;
    }
  }

  // Then, calculate blows using only unused digits
  for (let i = 0; i < secretDigits.length; i++) {
    if (guessUsed[i]) {
      // This guess digit was already used for a hit
      continue;
    }

    for (let j = 0; j < secretDigits.length; j++) {
      if (secretUsed[j]) {
        // This secret digit was already used for a hit
        continue;
      }

      if (i === j) {
        // Already checked for hits at the same position
        continue;
      }

      if (guessDigits[i] === secretDigits[j]) {
        blows++;
        secretUsed[j] = true; // Mark this secret digit as used for a blow
        // No need to mark guessUsed[i] as true here because we are iterating through guess digits
        // and this specific guessDigit[i] is only considered once for a blow.
        break; // Move to the next guess digit once a blow is found for it
      }
    }
  }

  return { hits, blows };
}
