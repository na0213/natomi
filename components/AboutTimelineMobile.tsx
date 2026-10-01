'use client';

import { useEffect, useRef } from 'react';
import styles from './AboutTimelineMobile.module.css';
import { createInkTimeline, type RowInfo } from './inkEngine';
import type { TimelineItem } from './AboutTimeline';

/** スマホ用の年表。しごと／かつどうそれぞれの左に、手描きの線・お花・フェレット・線画を重ねる */
function InkList({ items, side }: { items: TimelineItem[]; side: 'left' | 'right' }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ferretRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ferret = ferretRef.current;
    if (!box || !canvas || !ferret) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ink = createInkTimeline({ canvas, ferret, reduce, spineX: 13 });
    let anchorY = 0;

    const sync = () => {
      const top = box.getBoundingClientRect().top + window.scrollY;
      ink.setAnchor(anchorY - top);
    };

    const layout = () => {
      const w = box.clientWidth;
      const h = box.clientHeight;
      if (w < 10 || h < 10) return; // PC幅では非表示
      const br = box.getBoundingClientRect();
      const rows: RowInfo[] = [];
      box.querySelectorAll<HTMLElement>('[data-item]').forEach((el) => {
        const title = el.querySelector<HTMLElement>('[data-title]');
        if (title) {
          const tr = title.getBoundingClientRect();
          const y = tr.top - br.top + tr.height / 2;
          rows.push(side === 'left' ? { top: y, height: 0, leftY: y } : { top: y, height: 0, rightY: y });
        }
        const slot = el.querySelector<HTMLElement>('[data-slot]');
        if (slot && el.dataset.motif) {
          const sr = slot.getBoundingClientRect();
          rows.push({ top: sr.top - br.top, height: sr.height, motif: el.dataset.motif as RowInfo['motif'], doodleSide: 'R' });
        }
      });
      ink.layout(w, h, rows);
      sync();
    };

    const onScroll = () => {
      anchorY = window.scrollY + window.innerHeight * 0.62;
      sync();
    };

    layout();
    onScroll();
    const ro = new ResizeObserver(layout);
    ro.observe(box);
    document.fonts?.ready.then(layout);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
      ink.destroy();
    };
  }, [side]);

  return (
    <div ref={boxRef} className={styles.box}>
      <canvas ref={canvasRef} className={styles.ink} aria-hidden="true" />
      <div ref={ferretRef} className={styles.ferret} aria-hidden="true">
        <img src="/icons/up.png" alt="" width={40} height={40} className="animate-slow-bounce" />
      </div>
      <div className="space-y-5">
        {items.map((it) => (
          <div key={`${it.period}-${it.title}`} data-item data-motif={it.motif}>
            <div className="text-xs text-[#808080] mb-1">{it.period}</div>
            <div data-title className="text-[15px] font-semibold text-[#374151]">{it.title}</div>
            <p className="text-sm text-gray-700 mt-1">{it.description}</p>
            {it.motif && <div data-slot className={styles.slot} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutTimelineMobile({ items }: { items: TimelineItem[] }) {
  return (
    <div className="max-w-6xl mx-auto md:hidden">
      {/* しごと */}
      <h3 className="flex items-center justify-start text-base font-bold text-gray-700 mb-3">
        <img src="/icons/pink.png" alt="" aria-hidden="true" className="inline-block w-5 h-5 mr-2" />
        しごと
      </h3>
      <InkList items={items.filter((i) => i.side === 'left')} side="left" />

      {/* かつどう */}
      <h3 className="flex items-center justify-start text-base font-bold text-gray-700 mt-8 mb-3">
        <img src="/icons/green.png" alt="" aria-hidden="true" className="inline-block w-5 h-5 mr-2" />
        かつどう
      </h3>
      <InkList items={items.filter((i) => i.side === 'right')} side="right" />
    </div>
  );
}
