import React from 'react';
import { getMotionStyle } from './motionPrimitives';
import { useTokenProgress } from './useRhythm';

export function RhythmField() {
  const [value, setValue] = React.useState('');
  const [focused, setFocused] = React.useState(false);
  const { progress, reducedMotion } = useTokenProgress('quarter');

  const ringStyle = focused
    ? getMotionStyle('borderBloom', progress, reducedMotion)
    : undefined;

  return (
    <article className="rhythm-card rhythm-ui-card">
      <span className="rhythm-card__eyebrow">field + quarter focus ring</span>
      <h3>Rhythm Field</h3>
      <label
        className={`rhythm-field${focused ? ' is-focused' : ''}${value ? ' has-value' : ''}`}
        style={ringStyle}
      >
        <span className="rhythm-field__label">Motion note</span>
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Type into the rhythm"
        />
      </label>
      <p>A form field with a restrained focus treatment synced to the shared clock.</p>
    </article>
  );
}
