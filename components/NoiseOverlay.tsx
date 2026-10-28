'use client';

import React from 'react';

export function NoiseOverlay() {
  // Ultra-fine, sharp SVG feTurbulence fractal noise repeated seamlessly in a 160x160px tile
  const noiseSvgDataUri = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='editorialNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23editorialNoise)'/%3E%3C/svg%3E`;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 select-none overflow-hidden"
    >
      <div
        className="w-full h-full opacity-[0.038] mix-blend-screen will-change-transform"
        style={{
          backgroundImage: `url("${noiseSvgDataUri}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
        }}
      />
    </div>
  );
}
