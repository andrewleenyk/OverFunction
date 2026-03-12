import React from 'react';
import { useRhythmStore } from './RhythmProvider';
import {
  RHYTHM_TOKENS,
  RhythmTokenName,
  getTokenTiming,
} from './rhythmTokens';

export function useRhythm() {
  const store = useRhythmStore();

  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}

export function useTokenProgress(
  tokenName: RhythmTokenName,
  extraPhaseBeats = 0,
) {
  const rhythm = useRhythm();
  const token = RHYTHM_TOKENS[tokenName];

  return {
    token,
    ...getTokenTiming(rhythm.elapsedMs, rhythm.bpm, token, extraPhaseBeats),
    reducedMotion: rhythm.reducedMotion,
  };
}
