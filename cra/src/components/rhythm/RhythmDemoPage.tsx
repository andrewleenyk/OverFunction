import React from 'react';
import { RhythmProvider } from './RhythmProvider';
import { RhythmBox } from './RhythmBox';
import { RhythmButton } from './RhythmButton';
import { RhythmBorder } from './RhythmBorder';
import { RhythmMeter } from './RhythmMeter';
import { RhythmField } from './RhythmField';
import { RhythmOrchestra } from './RhythmOrchestra';
import { RhythmPhraseColor } from './RhythmPhraseColor';
import { RhythmRadioGroup } from './RhythmRadioGroup';
import { RhythmSwatch } from './RhythmSwatch';
import { RhythmText } from './RhythmText';
import { RhythmWordButton } from './RhythmWordButton';
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
          <div className="rhythm-page__title">
            <RhythmText />
          </div>
          <p className="rhythm-page__lede">
            A motion study where every element resolves to the same 130 BPM clock,
            turning rhythm into reusable design-system tokens.
          </p>
        </header>

        <aside className="rhythm-meta">
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
              One global 130 BPM clock. Small motion amplitudes. Shared rhythm language.
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

        <RhythmPhraseColor />

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

        <section className="rhythm-interface">
          <div className="rhythm-showcase__intro">
            <p className="rhythm-page__eyebrow">Rhythm applied to interface</p>
            <p className="rhythm-page__lede">
              The same motion language can govern controls, fields, and micro-typography,
              not just decorative demo surfaces.
            </p>
          </div>

          <div className="rhythm-grid" aria-label="Rhythm interface examples">
            <RhythmRadioGroup />
            <RhythmField />
            <RhythmWordButton />
          </div>
        </section>

        <section className="rhythm-showcase">
          <div className="rhythm-showcase__intro">
            <p className="rhythm-page__eyebrow">Same world, different properties</p>
            <p className="rhythm-page__lede">
              These examples extend the same rhythmic language into color, border,
              and progress without breaking the restrained visual system.
            </p>
          </div>

          <div className="rhythm-grid" aria-label="Rhythm showcase examples">
            <RhythmSwatch tokenName="quarter" label="Quarter Color Shift" hue={255} />
            <RhythmSwatch tokenName="offbeat" label="Offbeat Swatch" hue={22} />
            <RhythmBorder tokenName="eighth" label="Eighth Border Bloom" />
            <RhythmBorder tokenName="swingLight" label="Swing Border Bloom" />
            <RhythmMeter tokenName="triplet" label="Triplet Meter" segments={9} />
            <RhythmMeter tokenName="sixteenth" label="Sixteenth Meter" segments={8} />
          </div>
        </section>

        <RhythmOrchestra />
      </section>
    </RhythmProvider>
  );
}
