import React from 'react';
import { useRhythm } from './useRhythm';

interface OklchColor {
  l: number;
  c: number;
  h: number;
}

const PHRASE_COLORS: OklchColor[] = [
  { l: 62, c: 0.28, h: 320 }, // vivid magenta
  { l: 58, c: 0.24, h: 255 }, // electric indigo
  { l: 78, c: 0.24, h: 135 }, // acid lime
  { l: 68, c: 0.23, h: 28 },  // ember orange
];

function fract(value: number) {
  return value - Math.floor(value);
}

function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function interpolateHue(start: number, end: number, amount: number) {
  let delta = ((end - start + 540) % 360) - 180;
  return (start + delta * amount + 360) % 360;
}

function interpolateColor(start: OklchColor, end: OklchColor, amount: number): OklchColor {
  return {
    l: start.l + (end.l - start.l) * amount,
    c: start.c + (end.c - start.c) * amount,
    h: interpolateHue(start.h, end.h, amount),
  };
}

function formatOklch(color: OklchColor) {
  return `oklch(${color.l}% ${color.c} ${color.h})`;
}

export function RhythmPhraseColor() {
  const { bpm, beatMs, elapsedMs, reducedMotion } = useRhythm();
  const phraseMs = beatMs * 4;
  const phraseProgress = fract(elapsedMs / phraseMs);
  const segmentFloat = phraseProgress * PHRASE_COLORS.length;
  const segmentIndex = Math.floor(segmentFloat);
  const nextIndex = (segmentIndex + 1) % PHRASE_COLORS.length;
  const localProgress = reducedMotion ? 0 : easeInOutSine(fract(segmentFloat));

  const baseColor = interpolateColor(
    PHRASE_COLORS[segmentIndex],
    PHRASE_COLORS[nextIndex],
    localProgress,
  );

  const glowColor = interpolateColor(
    { ...baseColor, l: Math.min(baseColor.l + 12, 94), c: Math.max(baseColor.c - 0.04, 0.08) },
    { ...PHRASE_COLORS[nextIndex], l: Math.min(PHRASE_COLORS[nextIndex].l + 10, 94) },
    localProgress,
  );

  const beatIndex = Math.floor(elapsedMs / beatMs) % 4;
  const background = `
    radial-gradient(circle at 18% 20%, ${formatOklch(glowColor)}, transparent 42%),
    linear-gradient(135deg, ${formatOklch(baseColor)}, ${formatOklch({
      l: Math.max(baseColor.l - 18, 28),
      c: Math.max(baseColor.c - 0.08, 0.08),
      h: (baseColor.h + 26) % 360,
    })})
  `;

  return (
    <section
      className="rhythm-phrase"
      style={{ background }}
      aria-label={`Four-beat color phrase at ${bpm} BPM`}
    >
      <div className="rhythm-phrase__copy">
        <span className="rhythm-card__eyebrow">4-beat phrase + color shift</span>
        <h3>Phrase Color Cycle</h3>
        <p>
          A slower, bolder motion token that resolves across a full four-beat phrase
          instead of a single subdivision.
        </p>
      </div>
      <div className="rhythm-phrase__beats" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span key={index} className={index === beatIndex ? 'is-active' : undefined} />
        ))}
      </div>
    </section>
  );
}
