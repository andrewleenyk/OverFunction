import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { useRhythm, useTokenProgress } from './useRhythm';

interface OklchColor {
  l: number;
  c: number;
  h: number;
}

const ORCHESTRA_COLORS: OklchColor[] = [
  { l: 58, c: 0.22, h: 312 },
  { l: 54, c: 0.18, h: 252 },
  { l: 72, c: 0.18, h: 150 },
  { l: 65, c: 0.18, h: 36 },
];

function fract(value: number) {
  return value - Math.floor(value);
}

function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

function interpolateHue(start: number, end: number, amount: number) {
  const delta = ((end - start + 540) % 360) - 180;
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

function OrchestraChar({
  char,
  phase,
}: {
  char: string;
  phase: number;
}) {
  const { progress, reducedMotion } = useTokenProgress('triplet', phase);
  const style = reducedMotion ? undefined : getMotionStyle('nudge', progress, false);

  return (
    <span
      className="rhythm-orchestra__char"
      style={style}
      aria-hidden="true"
    >
      {char}
    </span>
  );
}

function OrchestraTitle() {
  const words = [
    'RHYTHM',
    'ORCHESTRA',
  ];

  return (
    <h3 className="rhythm-orchestra__title" aria-label="RHYTHM ORCHESTRA">
      {words.map((word, wordIndex) => (
        <span key={word} className="rhythm-orchestra__word">
          {word.split('').map((char, charIndex) => {
            return (
              <OrchestraChar
                key={`${word}-${charIndex}`}
                char={char}
                phase={charIndex * 0.01 + wordIndex * 0.04}
              />
            );
          })}
          {wordIndex < words.length - 1 && <span className="rhythm-orchestra__gap" aria-hidden="true" />}
        </span>
      ))}
    </h3>
  );
}

export function RhythmOrchestra() {
  const { beatMs, elapsedMs, reducedMotion } = useRhythm();
  const { progress: offbeatProgress } = useTokenProgress('offbeat');
  const { progress: sixteenthProgress, cycleIndex } = useTokenProgress('sixteenth');

  const phraseMs = beatMs * 4;
  const phraseProgress = fract(elapsedMs / phraseMs);
  const segmentFloat = phraseProgress * ORCHESTRA_COLORS.length;
  const segmentIndex = Math.floor(segmentFloat);
  const nextIndex = (segmentIndex + 1) % ORCHESTRA_COLORS.length;
  const localProgress = reducedMotion ? 0 : easeInOutSine(fract(segmentFloat));

  const baseColor = interpolateColor(
    ORCHESTRA_COLORS[segmentIndex],
    ORCHESTRA_COLORS[nextIndex],
    localProgress,
  );

  const accentColor = {
    l: Math.min(baseColor.l + 12, 90),
    c: Math.max(baseColor.c - 0.03, 0.08),
    h: (baseColor.h + 12) % 360,
  };

  const borderMix = 0.2 + offbeatProgress * 0.35;
  const borderColor = `color-mix(in oklab, ${formatOklch(accentColor)} ${Math.round(borderMix * 100)}%, rgba(255,255,255,0.18))`;
  const activeIndex = cycleIndex % 12;

  return (
    <section
      className="rhythm-orchestra"
      style={{
        background: `
          radial-gradient(circle at 18% 22%, ${formatOklch(accentColor)}, transparent 36%),
          linear-gradient(
            145deg,
            ${formatOklch(baseColor)},
            ${formatOklch({
              l: Math.max(baseColor.l - 14, 24),
              c: Math.max(baseColor.c - 0.08, 0.08),
              h: (baseColor.h + 28) % 360,
            })}
          )
        `,
        borderColor,
        boxShadow: `0 28px 80px rgba(0, 0, 0, 0.18), 0 0 ${8 + offbeatProgress * 22}px rgba(255,255,255,${0.05 + offbeatProgress * 0.08}) inset`,
      }}
    >
      <div className="rhythm-orchestra__copy">
        <span className="rhythm-card__eyebrow">Phrase + offbeat + sixteenth + triplet</span>
        <OrchestraTitle />
        <p>
          One composed panel where phrase color, offbeat structure, sixteenth-note
          subdivision, and triplet typography all belong to the same rhythmic system.
        </p>
      </div>

      <div className="rhythm-orchestra__meter" aria-hidden="true">
        <div
          className="rhythm-orchestra__meter-fill"
          style={{ transform: `scaleX(${reducedMotion ? 0.5 : sixteenthProgress})` }}
        />
        <div className="rhythm-orchestra__meter-segments">
          {Array.from({ length: 12 }, (_, index) => (
            <span key={index} className={index === activeIndex ? 'is-active' : undefined} />
          ))}
        </div>
      </div>
    </section>
  );
}
