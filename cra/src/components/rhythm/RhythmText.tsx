import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { RhythmTokenName } from './rhythmTokens';
import { useTokenProgress } from './useRhythm';

const WORD_TOKENS: Record<string, RhythmTokenName> = {
  DESIGN: 'quarter',
  SYSTEMS: 'eighth',
  MOVE: 'triplet',
  LIKE: 'sixteenth',
  MUSIC: 'offbeat',
};

function AnimatedChar({
  char,
  tokenName,
  index,
}: {
  char: string;
  tokenName: RhythmTokenName;
  index: number;
}) {
  const { progress, reducedMotion } = useTokenProgress(tokenName, index * 0.012);
  const style = getMotionStyle('nudge', progress, reducedMotion);

  return (
    <span
      className="rhythm-text__char"
      style={char === ' ' ? undefined : style}
      aria-hidden="true"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
}

export function RhythmText() {
  const words = ['DESIGN', 'SYSTEMS', 'MOVE', 'LIKE', 'MUSIC'];

  return (
    <section className="rhythm-text" aria-label="DESIGN SYSTEMS MOVE LIKE MUSIC">
      {words.map((word, wordIndex) => (
        <span
          key={word}
          className="rhythm-text__word"
          data-word-index={wordIndex}
        >
          {word.split('').map((char, charIndex) => (
            <AnimatedChar
              key={`${word}-${charIndex}`}
              char={char}
              tokenName={WORD_TOKENS[word]}
              index={charIndex}
            />
          ))}
        </span>
      ))}
    </section>
  );
}
