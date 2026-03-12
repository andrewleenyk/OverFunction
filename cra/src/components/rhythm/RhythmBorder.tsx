import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { RhythmTokenName } from './rhythmTokens';
import { useTokenProgress } from './useRhythm';

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function RhythmBorder({
  tokenName,
  label,
}: {
  tokenName: RhythmTokenName;
  label: string;
}) {
  const { progress, reducedMotion } = useTokenProgress(tokenName);
  const intensity = (Math.cos(progress * Math.PI * 2) + 1) / 2;
  const borderColor = `oklch(${mix(58, 82, intensity)}% ${mix(0.03, 0.12, intensity)} 280)`;

  return (
    <article
      className="rhythm-card rhythm-border-card"
      style={{
        borderColor,
        outline: `${1 + intensity * 2}px solid color-mix(in oklab, ${borderColor} 55%, transparent)`,
        outlineOffset: `${1 + intensity * 2}px`,
        ...getMotionStyle('borderBloom', progress, reducedMotion),
      }}
    >
      <span className="rhythm-card__eyebrow">{tokenName} + borderBloom</span>
      <h3>{label}</h3>
      <p>A restrained structural pulse that shifts emphasis without moving layout.</p>
    </article>
  );
}
