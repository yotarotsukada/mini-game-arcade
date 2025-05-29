import React from 'react';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  disabled: boolean;
  maxLength: number;
}

export default function GuessInput({ onSubmit, disabled, maxLength }: GuessInputProps) {
  const [guess, setGuess] = React.useState('');

  const handleSubmit = () => {
    if (guess.trim() === '') return;
    onSubmit(guess);
    setGuess(''); // Clear input after submission
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and limit length
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    if (numericValue.length <= maxLength) {
      setGuess(numericValue);
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="guess-input-container">
      <input
        type="text"
        value={guess}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={`Enter ${maxLength}-digit number`}
      />
      <button onClick={handleSubmit} disabled={disabled || guess.length !== maxLength}>
        Guess
      </button>
    </div>
  );
}
