import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { RhythmPrimitiveName, RhythmTokenName } from './rhythmTokens';
import { useTokenProgress } from './useRhythm';

export function RhythmBox({
  tokenName,
  primitive,
  title,
}: {
  tokenName: RhythmTokenName;
  primitive: RhythmPrimitiveName;
  title?: string;
}) {
  const { token, progress, reducedMotion } = useTokenProgress(tokenName);
  const style = getMotionStyle(primitive, progress, reducedMotion);

  return (
    <article className="rhythm-card rhythm-box" style={style}>
      <span className="rhythm-card__eyebrow">
        {token.name} + {primitive}
      </span>
      <h3>{title ?? token.label}</h3>
      <p>{token.description}</p>
    </article>
  );
}
