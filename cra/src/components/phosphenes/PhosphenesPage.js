import React from 'react';
import './phosphenes.css';

const GRID_SIZE = 100;

export default function PhosphenesPage() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = GRID_SIZE;
    canvas.height = GRID_SIZE;

    const context = canvas.getContext('2d');
    if (!context) return;

    for (let y = 0; y < GRID_SIZE; y += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 60 + Math.random() * 30;
        const lightness = 38 + Math.random() * 28;
        context.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        context.fillRect(x, y, 1, 1);
      }
    }
  }, []);

  return (
    <section className="phosphenes-page">
      <canvas
        ref={canvasRef}
        className="phosphenes-canvas"
        role="img"
        aria-label="A 100 by 100 field of random colored tiles"
      />
    </section>
  );
}
