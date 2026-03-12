import React from 'react';
import { RhythmProvider } from './RhythmProvider';
import { RhythmBox } from './RhythmBox';
import { RhythmButton } from './RhythmButton';
import { RhythmText } from './RhythmText';
import { RHYTHM_TOKEN_LIST } from './rhythmTokens';
import './rhythm.css';

const BOX_DEMOS = [
  { tokenName: 'quarter', primitive: 'pulse', title: 'Quarter Pulse' },
  { tokenName: 'eighth', primitive: 'nudge', title: 'Eighth Nudge' },
  { tokenName: 'sixteenth', primitive: 'glow', title: 'Sixteenth Glow' },
  { tokenName: 'triplet', primitive: 'pulse', title: 'Triplet Pulse' },
  { tokenName: 'offbeat', primitive: 'glow', title: 'Offbeat Bloom' },
  { tokenName: 'swingLight', primitive: 'nudge', title: 'Swing Light' },
] as const;

const BUTTON_DEMOS = [
  { tokenName: 'offbeat', primitive: 'glow', label: 'Offbeat Glow' },
  { tokenName: 'quarter', primitive: 'nudge', label: 'Quarter Nudge' },
  { tokenName: 'triplet', primitive: 'pulse', label: 'Triplet Pulse' },
] as const;

export default function RhythmDemoPage() {
  return (
    <RhythmProvider bpm={130}>
      <section className="rhythm-page">
        <header className="rhythm-page__header">
          <p className="rhythm-page__eyebrow">Rhythm Design System Demo</p>
          <h2>Rhythm Design System Demo</h2>
          <p className="rhythm-page__lede">
            A motion study where every element resolves to the same 130 BPM clock,
            turning rhythm into reusable design-system tokens.
          </p>
        </header>

        <aside className="rhythm-meta">
          <div className="rhythm-meta__item">
            <span className="rhythm-meta__label">BPM</span>
            <strong>130</strong>
          </div>
          <div className="rhythm-meta__item rhythm-meta__item--wide">
            <span className="rhythm-meta__label">Tokens</span>
            <div className="rhythm-token-list">
              {RHYTHM_TOKEN_LIST.map((token) => (
                <span key={token.name}>{token.name}</span>
              ))}
            </div>
          </div>
          <div className="rhythm-meta__item rhythm-meta__item--wide">
            <span className="rhythm-meta__label">Experiment</span>
            <p>
              One global clock. Small motion amplitudes. Shared rhythm language.
            </p>
          </div>
        </aside>

        <section className="rhythm-grid" aria-label="Rhythm demo boxes">
          {BOX_DEMOS.map((demo) => (
            <RhythmBox
              key={`${demo.tokenName}-${demo.primitive}`}
              tokenName={demo.tokenName}
              primitive={demo.primitive}
              title={demo.title}
            />
          ))}
        </section>

        <section className="rhythm-controls" aria-label="Rhythm demo buttons">
          {BUTTON_DEMOS.map((demo) => (
            <RhythmButton
              key={`${demo.tokenName}-${demo.primitive}`}
              tokenName={demo.tokenName}
              primitive={demo.primitive}
              label={demo.label}
            />
          ))}
        </section>

        <section className="rhythm-copy">
          <p className="rhythm-copy__label">Animated sentence</p>
          <RhythmText />
        </section>
      </section>
    </RhythmProvider>
  );
}
