import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles.css';
import { setTheme } from './theme';

function Header({ label }) {
  return (
    <header className="header">
      <h1 className="site-title">
        <Link to="/">OverFunction</Link>
        <span className="title-sep"> / </span>
        <span className="page-label">{label}</span>
      </h1>
    </header>
  );
}

function AudioButton() {
  const audioRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    let el = document.getElementById('site-audio');
    if (!el) {
      el = document.createElement('audio');
      el.id = 'site-audio';
      el.preload = 'auto';
      el.src = encodeURI('/assets/audio/TEED, ANOTR - Sound of You  (Extended Mix).mp3');
      el.style.display = 'none';
      document.body.appendChild(el);
    }
    audioRef.current = el;
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setIsPlaying(false);
    }
  }

  return (
    <button
      className="audio-toggle"
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      title={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? '⏸' : '▶'}
    </button>
  );
}

function ThemeToggle() {
  const [mode, setMode] = React.useState(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  function toggle() {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    setTheme(next);
  }

  const glyph = mode === 'dark' ? '☼' : '☾';
  const label = mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button className="theme-toggle" type="button" onClick={toggle} aria-label={label} title={label}>
      {glyph}
    </button>
  );
}

function Home() {
  return (
    <main className="container">
      <Header label="my vomit journal" />
      <nav className="home-links" aria-label="site">
        <ul>
          <li><Link to="/gallery" aria-label="gallery" title="gallery">🖼️</Link></li>
        </ul>
      </nav>
      <section className="poem">
        <figure className="poem-card">
          <blockquote>
            <p>We lent it our hands until it learned to be its own.</p>
            <p>Now our hands hang still, with nothing left to make.</p>
            <p className="poem-muted">We spent our lives in the making, and forgot how to be.</p>
            <p>Now our thoughts may build what hands never could.</p>
          </blockquote>
          <figcaption>— Me</figcaption>
        </figure>
      </section>
    </main>
  );
}

function HorizontalGallery({ images }) {
  const ref = React.useRef(null);
  const [showHint, setShowHint] = React.useState(true);
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const hide = () => setShowHint(false);
    function onKey(e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const slideW = el.clientWidth || window.innerWidth;
      const current = Math.round(el.scrollLeft / Math.max(1, slideW));
      const delta = e.key === 'ArrowRight' ? 1 : -1;
      const idx = Math.max(0, Math.min(images.length - 1, current + delta));
      el.scrollTo({ left: idx * slideW, behavior: prefersReduced ? 'auto' : 'smooth' });
      e.preventDefault();
    }
    el.addEventListener('keydown', onKey);
    el.addEventListener('scroll', hide, { passive: true });
    const t = window.setTimeout(hide, 3500);
    return () => {
      el.removeEventListener('keydown', onKey);
      el.removeEventListener('scroll', hide);
      window.clearTimeout(t);
    };
  }, [images, prefersReduced]);

  return (
    <section className="hgallery" tabIndex={0} ref={ref}>
      {images.map((src, i) => (
        <figure className="hslide" key={i}>
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ maxWidth: '100vw', maxHeight: '70vh', width: 'auto', height: 'auto', objectFit: 'contain' }}
          />
        </figure>
      ))}
      {showHint && <div className="swipe-hint" aria-hidden="true">↔︎</div>}
    </section>
  );
}

function Gallery() {
  const [images, setImages] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    const url = '/images/images.json?v=3';
    fetch(url, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : []))
      .then(list => {
        if (cancelled) return;
        const names = Array.isArray(list) && list.length ? list : ['elephantdanielfirman.jpg', 'hefti.webp', 'fishman.jpg'];
        setImages(names.map(n => (n.startsWith('http') ? n : '/images/' + n.replace(/^\//, ''))));
      })
      .catch(() => { if (!cancelled) setImages([
        '/images/elephantdanielfirman.jpg',
        '/images/hefti.webp',
        '/images/emilalzamora.webp',
        '/images/rothko.jpg',
        '/images/mariamartins.jpg',
        '/images/Remedios.jpg'
      ]); });
    return () => { cancelled = true; };
  }, []);

  if (images === null) return <section className="mosaic"><div className="placeholder">Loading images...</div></section>;
  if (!images.length) return <section className="mosaic"><div className="placeholder">No images found in /images</div></section>;

  return (
    <main className="container gallery-full">
      <Header label="🖼️" />
      <HorizontalGallery images={images} />
    </main>
  );
}

function AlgorithmSculpting() {
  return (
    <main className="container post-full">
      <Header label="algorithm sculpting" />
      <section className="post">
        <article className="prose">
          <p className="lead">algorithm sculpting</p>
          <p>Discovery used to mean digging: dusty crates, late-night forums, whispered label names. Today, we let algorithms deliver our taste to us like room service. Convenient — and dangerously homogenizing.</p>
          <p>These systems aren’t neutral. They’re designed to reinforce what’s already popular, drip-feeding us familiarity dressed up as personalization. Great for the average listener. Deadly for a DJ chasing the unfamiliar.</p>
          <h3>Method</h3>
          <p>Create streaming accounts with crafted identities — blank slates taught from day one to crave the obscure.</p>
          <p>Only feed them the sounds you want more of:</p>
          <ul>
            <li>Deep hypnotic grooves</li>
            <li>Strange percussive edits</li>
            <li>Niche corners of the underground</li>
          </ul>
          <h3>Chaos</h3>
          <p>Occasionally inject pure chaos — a country anthem, a black-metal blast, a bubblegum pop relic.</p>
          <p>These anomalies jolt the system awake. They push it away from the comfortable center and toward the weird perimeter, where innovation usually hides. A small act of sabotage that produces beautifully unexpected outcomes.</p>
          <p>In a world where machines decide what we hear, hacking the machine becomes a form of creative authorship.</p>
          <p>True digging isn’t dead. It’s evolving — and it’s our job to stay one step ahead.</p>
        </article>
        <aside className="post-media">
          <img src="/assets/posts/algorithm-sculpting/splotch.jpg?v=2" alt="" loading="lazy" decoding="async" />
        </aside>
      </section>
    </main>
  );
}

function OklchDemo() {
  const [l, setL] = React.useState(70);      // 0–100 (percent)
  const [c, setC] = React.useState(0.12);    // ~0–0.4 common gamut
  const [h, setH] = React.useState(40);      // 0–360 degrees
  const cssColor = `oklch(${l}% ${c} ${h})`;
  const supports = typeof window !== 'undefined'
    ? CSS.supports('color', 'oklch(70% 0.12 40)')
    : true;

  function copy() {
    navigator.clipboard?.writeText(cssColor).catch(() => {});
  }

  const tints = Array.from({ length: 7 }, (_, i) => {
    const ll = Math.round((15 + i * 12)); // 15%..87%
    return `oklch(${ll}% ${c} ${h})`;
  });

  return (
    <main className="container">
      <Header label="oklch" />
      <section className="oklch-demo">
        <div className="oklch-preview" style={{ background: cssColor }} />
        <div className="oklch-controls">
          <div className="row">
            <label htmlFor="l">L</label>
            <input id="l" type="range" min="0" max="100" step="1" value={l}
                   onChange={e => setL(Number(e.target.value))} />
            <input type="number" min="0" max="100" step="1" value={l}
                   onChange={e => setL(Math.max(0, Math.min(100, Number(e.target.value))))} />
            <span className="unit">%</span>
          </div>
          <div className="row">
            <label htmlFor="c">C</label>
            <input id="c" type="range" min="0" max="0.4" step="0.001" value={c}
                   onChange={e => setC(Number(e.target.value))} />
            <input type="number" min="0" max="1" step="0.001" value={c}
                   onChange={e => setC(Math.max(0, Math.min(1, Number(e.target.value))))} />
          </div>
          <div className="row">
            <label htmlFor="h">h</label>
            <input id="h" type="range" min="0" max="360" step="1" value={h}
                   onChange={e => setH(Number(e.target.value))} />
            <input type="number" min="0" max="360" step="1" value={h}
                   onChange={e => setH(Math.max(0, Math.min(360, Number(e.target.value))))} />
            <span className="unit">°</span>
          </div>
          <div className="code">
            <code>background: {cssColor};</code>
            <button type="button" onClick={copy} className="ghost">copy</button>
          </div>
          {!supports && (
            <p className="note">
              Your browser may not render OKLCH. Try a recent Chrome, Edge, Safari, or Firefox.
            </p>
          )}
        </div>
        <div className="oklch-strip">
          {tints.map((bg, i) => (
            <div key={i} className="sw" style={{ background: bg }} title={bg} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <>
      <ThemeToggle />
      <AudioButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/algorithm-sculpting" element={<AlgorithmSculpting />} />
        <Route path="/oklch" element={<OklchDemo />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
