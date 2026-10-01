'use client';

import { useEffect, useRef } from 'react';
import { createHero } from './heroEngine';

/** トップの背景：手描きの線画の世界と、弾む動物たち（Canvas） */
export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLCanvasElement>(null);
  const nearRef = useRef<HTMLCanvasElement>(null);
  const actRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const far = farRef.current;
    const near = nearRef.current;
    const act = actRef.current;
    if (!wrap || !far || !near || !act) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = createHero({ wrap, far, near, act, reduce });
    return () => hero.destroy();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <canvas ref={farRef} className="absolute will-change-transform" />
      <canvas ref={nearRef} className="absolute will-change-transform" />
      <canvas ref={actRef} className="absolute left-0 top-0 h-full w-full" />
    </div>
  );
}
