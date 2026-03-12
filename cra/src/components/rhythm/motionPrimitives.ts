import { CSSProperties } from 'react';
import { RhythmPrimitiveName } from './rhythmTokens';

function rhythmicEnvelope(progress: number): number {
  const wave = (Math.cos(progress * Math.PI * 2) + 1) / 2;
  return Math.pow(wave, 3);
}

export function getMotionStyle(
  primitive: RhythmPrimitiveName,
  progress: number,
  reducedMotion: boolean,
): CSSProperties {
  if (reducedMotion) {
    return {};
  }

  const strength = rhythmicEnvelope(progress);

  switch (primitive) {
    case 'pulse':
      return {
        transform: `scale(${1 + strength * 0.035})`,
        opacity: 0.92 + strength * 0.08,
      };

    case 'nudge':
      return {
        transform: `translateY(${-6 * strength}px) scale(${1 + strength * 0.012})`,
        opacity: 0.9 + strength * 0.08,
      };

    case 'glow':
      return {
        boxShadow: `0 0 ${10 + strength * 28}px rgba(132, 132, 132, ${0.06 + strength * 0.14})`,
        opacity: 0.88 + strength * 0.12,
      };

    case 'colorShift':
      return {
        opacity: 0.94 + strength * 0.06,
        filter: `saturate(${1 + strength * 0.16}) brightness(${1 + strength * 0.08})`,
      };

    case 'borderBloom':
      return {
        opacity: 0.92 + strength * 0.08,
        boxShadow: `0 0 ${6 + strength * 18}px rgba(150, 150, 150, ${0.04 + strength * 0.08})`,
      };

    default:
      return {};
  }
}
