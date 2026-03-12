export type RhythmTokenName =
  | 'quarter'
  | 'eighth'
  | 'sixteenth'
  | 'triplet'
  | 'offbeat'
  | 'swingLight';

export type RhythmPrimitiveName = 'pulse' | 'nudge' | 'glow';

export interface RhythmToken {
  name: RhythmTokenName;
  label: string;
  description: string;
  subdivisionPerBeat: number;
  phaseBeats?: number;
  swing?: number;
}

export const RHYTHM_TOKENS: Record<RhythmTokenName, RhythmToken> = {
  quarter: {
    name: 'quarter',
    label: 'Quarter',
    description: 'One pulse per beat.',
    subdivisionPerBeat: 1,
  },
  eighth: {
    name: 'eighth',
    label: 'Eighth',
    description: 'Two even pulses per beat.',
    subdivisionPerBeat: 2,
  },
  sixteenth: {
    name: 'sixteenth',
    label: 'Sixteenth',
    description: 'Four fast pulses per beat.',
    subdivisionPerBeat: 4,
  },
  triplet: {
    name: 'triplet',
    label: 'Triplet',
    description: 'Three evenly spaced pulses inside each beat.',
    subdivisionPerBeat: 3,
  },
  offbeat: {
    name: 'offbeat',
    label: 'Offbeat',
    description: 'Quarter-note pulse offset halfway between beats.',
    subdivisionPerBeat: 1,
    phaseBeats: 0.5,
  },
  swingLight: {
    name: 'swingLight',
    label: 'Swing Light',
    description: 'An eighth-note pulse with a gentle swing ratio.',
    subdivisionPerBeat: 2,
    swing: 0.58,
  },
};

export const RHYTHM_TOKEN_LIST = Object.values(RHYTHM_TOKENS);

function fract(value: number): number {
  return value - Math.floor(value);
}

export interface TokenTiming {
  progress: number;
  cycleIndex: number;
}

export function getTokenTiming(
  elapsedMs: number,
  bpm: number,
  token: RhythmToken,
  extraPhaseBeats = 0,
): TokenTiming {
  const beatMs = 60000 / bpm;
  const beatProgress = fract(
    elapsedMs / beatMs + (token.phaseBeats ?? 0) + extraPhaseBeats,
  );

  if (token.swing) {
    const split = token.swing;
    if (beatProgress < split) {
      return {
        progress: beatProgress / split,
        cycleIndex: Math.floor(elapsedMs / beatMs) * 2,
      };
    }

    return {
      progress: (beatProgress - split) / (1 - split),
      cycleIndex: Math.floor(elapsedMs / beatMs) * 2 + 1,
    };
  }

  const cyclePosition = beatProgress * token.subdivisionPerBeat;
  return {
    progress: fract(cyclePosition),
    cycleIndex: Math.floor(cyclePosition),
  };
}
