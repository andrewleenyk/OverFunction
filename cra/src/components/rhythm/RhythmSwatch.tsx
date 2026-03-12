import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { RhythmTokenName } from './rhythmTokens';
import { useTokenProgress } from './useRhythm';

function mix(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

export function RhythmSwatch({
  tokenName,
  label,
  hue = 260,
}: {
  tokenName: RhythmTokenName;
  label: string;
  hue?: number;
}) {
  const { progress, reducedMotion } = useTokenProgress(tokenName);
  const intensity = (Math.cos(progress * Math.PI * 2) + 1) / 2;
  const lightness = mix(52, 74, intensity);
  const chroma = mix(0.08, 0.19, intensity);
  const swatch = `oklch(${lightness}% ${chroma} ${hue})`;
  const accent = `oklch(${Math.min(lightness + 10, 92)}% ${Math.max(chroma - 0.03, 0.04)} ${hue})`;

  return (
    <article className="rhythm-card rhythm-swatch-card">
      <span className="rhythm-card__eyebrow">{tokenName} + colorShift</span>
      <div
        className="rhythm-swatch"
        style={{
          background: `linear-gradient(135deg, ${swatch}, ${accent})`,
          ...getMotionStyle('colorShift', progress, reducedMotion),
        }}
      />
      <h3>{label}</h3>
      <p>Lightness and chroma move with the same shared rhythmic token.</p>
    </article>
  );
}
