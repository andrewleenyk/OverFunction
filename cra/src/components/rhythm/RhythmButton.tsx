import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { RhythmPrimitiveName, RhythmTokenName } from './rhythmTokens';
import { useTokenProgress } from './useRhythm';

export function RhythmButton({
  tokenName,
  primitive,
  label,
}: {
  tokenName: RhythmTokenName;
  primitive: RhythmPrimitiveName;
  label: string;
}) {
  const { progress, reducedMotion } = useTokenProgress(tokenName);
  const style = getMotionStyle(primitive, progress, reducedMotion);

  return (
    <button type="button" className="rhythm-button" style={style}>
      <span>{label}</span>
      <small>
        {tokenName} + {primitive}
      </small>
    </button>
  );
}
