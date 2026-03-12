import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { RhythmTokenName } from './rhythmTokens';
import { useTokenProgress } from './useRhythm';

const OPTIONS: Array<{ value: RhythmTokenName; label: string }> = [
  { value: 'quarter', label: 'Quarter' },
  { value: 'offbeat', label: 'Offbeat' },
  { value: 'triplet', label: 'Triplet' },
];

function RhythmRadioOption({
  tokenName,
  label,
  checked,
  onSelect,
}: {
  tokenName: RhythmTokenName;
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  const { progress, reducedMotion } = useTokenProgress(tokenName);
  const style = checked
    ? getMotionStyle('glow', progress, reducedMotion)
    : undefined;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      className={`rhythm-radio__option${checked ? ' is-selected' : ''}`}
      onClick={onSelect}
      style={style}
    >
      <span className="rhythm-radio__dot" />
      <span>{label}</span>
    </button>
  );
}

export function RhythmRadioGroup() {
  const [selected, setSelected] = React.useState<RhythmTokenName>('offbeat');

  return (
    <article className="rhythm-card rhythm-ui-card">
      <span className="rhythm-card__eyebrow">radio group + token selection</span>
      <h3>Rhythm Radio Group</h3>
      <div className="rhythm-radio" role="radiogroup" aria-label="Rhythm token options">
        {OPTIONS.map((option) => (
          <RhythmRadioOption
            key={option.value}
            tokenName={option.value}
            label={option.label}
            checked={selected === option.value}
            onSelect={() => setSelected(option.value)}
          />
        ))}
      </div>
      <p>A selection control where each option carries its own rhythmic emphasis.</p>
    </article>
  );
}
