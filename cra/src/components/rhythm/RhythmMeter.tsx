import React from 'react';
import { RhythmTokenName } from './rhythmTokens';
import { useTokenProgress } from './useRhythm';

export function RhythmMeter({
  tokenName,
  label,
  segments = 8,
}: {
  tokenName: RhythmTokenName;
  label: string;
  segments?: number;
}) {
  const { progress, cycleIndex, reducedMotion } = useTokenProgress(tokenName);
  const activeIndex = cycleIndex % segments;
  const fill = reducedMotion ? 0.5 : progress;

  return (
    <article className="rhythm-card rhythm-meter-card">
      <span className="rhythm-card__eyebrow">{tokenName} + meter</span>
      <div className="rhythm-meter" aria-hidden="true">
        <div className="rhythm-meter__fill" style={{ transform: `scaleX(${fill})` }} />
        <div
          className="rhythm-meter__segments"
          style={{ gridTemplateColumns: `repeat(${segments}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: segments }, (_, index) => (
            <span
              key={index}
              className={index === activeIndex ? 'is-active' : undefined}
            />
          ))}
        </div>
      </div>
      <h3>{label}</h3>
      <p>One token, visualized as repeated subdivision and measure-like progression.</p>
    </article>
  );
}
