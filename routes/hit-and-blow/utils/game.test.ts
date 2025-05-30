import { describe, it, expect } from 'vitest';
import { generateSecretNumber, calculateHitAndBlow } from './game';

describe('generateSecretNumber', () => {
  it('should generate a number string of the correct length', () => {
    expect(generateSecretNumber(4)).toHaveLength(4);
    expect(generateSecretNumber(1)).toHaveLength(1);
    expect(generateSecretNumber(10)).toHaveLength(10);
  });

  it('should generate a number string with unique digits', () => {
    const numStr = generateSecretNumber(4);
    const uniqueDigits = new Set(numStr.split(''));
    expect(uniqueDigits.size).toBe(numStr.length);

    const numStr10 = generateSecretNumber(10);
    const uniqueDigits10 = new Set(numStr10.split(''));
    expect(uniqueDigits10.size).toBe(numStr10.length);
  });

  it('should handle single digit generation', () => {
    const numStr = generateSecretNumber(1);
    expect(numStr).toHaveLength(1);
    expect(parseInt(numStr, 10)).toBeGreaterThanOrEqual(0);
    expect(parseInt(numStr, 10)).toBeLessThanOrEqual(9);
  });

  it('should throw an error for invalid digit counts', () => {
    expect(() => generateSecretNumber(0)).toThrowError('Number of digits must be between 1 and 10.');
    expect(() => generateSecretNumber(11)).toThrowError('Number of digits must be between 1 and 10.');
    expect(() => generateSecretNumber(-1)).toThrowError('Number of digits must be between 1 and 10.');
  });
});

describe('calculateHitAndBlow', () => {
  it('secret = "1234", guess = "1234" (all hits)', () => {
    expect(calculateHitAndBlow("1234", "1234")).toEqual({ hits: 4, blows: 0 });
  });

  it('secret = "1234", guess = "4321" (all blows)', () => {
    expect(calculateHitAndBlow("1234", "4321")).toEqual({ hits: 0, blows: 4 });
  });

  it('secret = "1234", guess = "1243" (2 hits, 2 blows)', () => {
    expect(calculateHitAndBlow("1234", "1243")).toEqual({ hits: 2, blows: 2 });
  });
  
  it('secret = "1234", guess = "2134" (2 hits, 2 blows) - example from problem desc', () => {
    expect(calculateHitAndBlow("1234", "2134")).toEqual({ hits: 2, blows: 2 });
  });

  it('secret = "1234", guess = "1456" (1 hit, 1 blow)', () => {
    // '1' is a hit. '4' is in secret but wrong position -> blow.
    expect(calculateHitAndBlow("1234", "1456")).toEqual({ hits: 1, blows: 1 });
  });

  it('secret = "1234", guess = "5678" (no hits, no blows)', () => {
    expect(calculateHitAndBlow("1234", "5678")).toEqual({ hits: 0, blows: 0 });
  });
  
  it('secret = "1234", guess = "1354" (2 hits, 1 blow) - example from problem desc', () => {
    // 1 and 4 are hits. 3 is a blow.
    expect(calculateHitAndBlow("1234", "1354")).toEqual({ hits: 2, blows: 1 });
  });

  it('secret = "1123", guess = "1411" (handling duplicates in secret and guess)', () => {
    // Current generateSecretNumber produces unique digits, but calculateHitAndBlow should be robust.
    // Secret: S1 S2 S3 S4 (1a 1b 2c 3d)
    // Guess:  G1 G2 G3 G4 (1e 4f 1g 1h)
    // G1 (1e) vs S1 (1a) -> hit. secretUsed[0]=true, guessUsed[0]=true
    // G3 (1g) vs S2 (1b) -> hit. secretUsed[1]=true, guessUsed[2]=true
    // Result: { hits: 2, blows: 0 }
    // Let's trace the provided example: secret = "1123", guess = "1411"
    // Hits:
    // guess[0] (1) === secret[0] (1) -> hits = 1. secretUsed[0]=true, guessUsed[0]=true.
    // guess[2] (1) !== secret[2] (2)
    // Blows:
    // guess[1] (4): not in secret.
    // guess[2] (1): secretUsed[0] is true. secret[1] (1) is available. guess[2] === secret[1]. blows = 1. secretUsed[1]=true.
    // guess[3] (1): secretUsed[0] is true. secretUsed[1] is true. No more '1's in secret.
    // Expected: { hits: 1, blows: 1 } based on typical Hit & Blow rules where each digit instance is unique.
    expect(calculateHitAndBlow("1123", "1411")).toEqual({ hits: 1, blows: 1 });
  });

  it('secret = "1213", guess = "1111" (handling more duplicates)', () => {
    // Secret: S1(1a) S2(2b) S3(1c) S4(3d)
    // Guess:  G1(1e) G2(1f) G3(1g) G4(1h)
    // Hits:
    // G1(1e) === S1(1a) -> hits = 1. secretUsed[0]=true, guessUsed[0]=true.
    // G3(1g) === S3(1c) -> hits = 1. secretUsed[2]=true, guessUsed[2]=true.
    // Total Hits: 2
    // Blows:
    // G2(1f): (guessUsed[1] is false)
    //   S1(1a) is used (secretUsed[0]=true)
    //   S3(1c) is used (secretUsed[2]=true)
    //   No other '1's in secret.
    // G4(1h): (guessUsed[3] is false)
    //   S1(1a) is used.
    //   S3(1c) is used.
    //   No other '1's in secret.
    // Total Blows: 0
    expect(calculateHitAndBlow("1213", "1111")).toEqual({ hits: 2, blows: 0 });
  });
  
  it('secret = "123", guess = "111" (fewer unique digits in guess)', () => {
    expect(calculateHitAndBlow("123", "111")).toEqual({ hits: 1, blows: 0 });
  });
  
  it('secret = "111", guess = "123" (fewer unique digits in secret)', () => {
    expect(calculateHitAndBlow("111", "123")).toEqual({ hits: 1, blows: 0 });
  });

  it('should throw an error if secret and guess have different lengths', () => {
    expect(() => calculateHitAndBlow("123", "1234")).toThrowError('Secret and guess must have the same length.');
    expect(() => calculateHitAndBlow("1234", "123")).toThrowError('Secret and guess must have the same length.');
  });

  it('should return 0 hits and 0 blows for empty strings of same length (edge case, though length > 0 assumed by generate)', () => {
    expect(calculateHitAndBlow("", "")).toEqual({ hits: 0, blows: 0 });
  });
});
