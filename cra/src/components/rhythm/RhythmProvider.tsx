import React from 'react';

export interface RhythmSnapshot {
  bpm: number;
  beatMs: number;
  elapsedMs: number;
  reducedMotion: boolean;
}

interface RhythmStore {
  getSnapshot: () => RhythmSnapshot;
  subscribe: (listener: () => void) => () => void;
  start: () => () => void;
}

const RhythmContext = React.createContext<RhythmStore | null>(null);

function createRhythmStore(bpm: number): RhythmStore {
  const beatMs = 60000 / bpm;
  const listeners = new Set<() => void>();
  const mediaQuery =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  let startedAt = 0;
  let frameId = 0;
  let snapshot: RhythmSnapshot = {
    bpm,
    beatMs,
    elapsedMs: 0,
    reducedMotion: mediaQuery?.matches ?? false,
  };

  const emit = () => {
    listeners.forEach((listener) => listener());
  };

  const tick = (now: number) => {
    snapshot = {
      bpm,
      beatMs,
      elapsedMs: now - startedAt,
      reducedMotion: mediaQuery?.matches ?? false,
    };
    emit();
    frameId = window.requestAnimationFrame(tick);
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    start: () => {
      startedAt = window.performance.now();
      frameId = window.requestAnimationFrame(tick);

      const handleMediaChange = () => {
        snapshot = {
          ...snapshot,
          reducedMotion: mediaQuery?.matches ?? false,
        };
        emit();
      };

      mediaQuery?.addEventListener('change', handleMediaChange);

      return () => {
        window.cancelAnimationFrame(frameId);
        mediaQuery?.removeEventListener('change', handleMediaChange);
      };
    },
  };
}

export function RhythmProvider({
  bpm = 130,
  children,
}: {
  bpm?: number;
  children: React.ReactNode;
}) {
  const storeRef = React.useRef<RhythmStore | null>(null);

  if (!storeRef.current && typeof window !== 'undefined') {
    storeRef.current = createRhythmStore(bpm);
  }

  React.useEffect(() => {
    if (!storeRef.current) {
      return undefined;
    }

    /**
     * One requestAnimationFrame loop drives the whole demo.
     * Every consumer subscribes to the same elapsed time snapshot so all motion
     * stays phase-locked to a single 130 BPM clock.
     */
    return storeRef.current.start();
  }, []);

  if (!storeRef.current) {
    return <>{children}</>;
  }

  return (
    <RhythmContext.Provider value={storeRef.current}>
      {children}
    </RhythmContext.Provider>
  );
}

export function useRhythmStore(): RhythmStore {
  const store = React.useContext(RhythmContext);

  if (!store) {
    throw new Error('useRhythmStore must be used inside RhythmProvider');
  }

  return store;
}
