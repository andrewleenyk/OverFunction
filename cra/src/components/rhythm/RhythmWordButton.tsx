import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { RhythmTokenName } from './rhythmTokens';
import { useTokenProgress } from './useRhythm';

const LETTER_TOKENS: Array<{ char: string; token: RhythmTokenName }> = [
  { char: 'O', token: 'quarter' },
  { char: 'R', token: 'offbeat' },
  { char: 'B', token: 'triplet' },
  { char: 'I', token: 'sixteenth' },
  { char: 'T', token: 'swingLight' },
];

function AnimatedLetter({
  char,
  tokenName,
  index,
}: {
  char: string;
  tokenName: RhythmTokenName;
  index: number;
}) {
  const { progress, reducedMotion } = useTokenProgress(tokenName, index * 0.01);
  const style = getMotionStyle('nudge', progress, reducedMotion);

  return (
    <span className="rhythm-word-button__char" style={style} aria-hidden="true">
      {char}
    </span>
  );
}

export function RhythmWordButton() {
  return (
    <article className="rhythm-card rhythm-ui-card">
      <span className="rhythm-card__eyebrow">word button + mixed tokens</span>
      <h3>Rhythm Word Button</h3>
      <button type="button" className="rhythm-word-button" aria-label="ORBIT">
        {LETTER_TOKENS.map((letter, index) => (
          <AnimatedLetter
            key={`${letter.char}-${index}`}
            char={letter.char}
            tokenName={letter.token}
            index={index}
          />
        ))}
      </button>
      <p>A single word whose letters each carry a different rhythmic identity.</p>
    </article>
  );
}
