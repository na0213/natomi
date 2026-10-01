'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import styles from './WorkCard.module.css';

/** 作品詳細ページの「開発の流れ」にある見出しをそのまま使う */
export type WorkLayers = { design: string; build: string; release: string };

export type WorkCardItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  videoSrc?: string;
  imageSrc?: string;
  thumbnail?: string;
  href?: string;
  ratio: number;        // メディアの縦横比（幅/高さ）
  layers: WorkLayers;
};

// コードの層：色つきの棒（インデント, [幅%, 色]…）
const CODE_LINES: { indent: number; bars: [number, 'p' | 'b' | 'g' | 'y'][] }[] = [
  { indent: 0, bars: [[22, 'p'], [30, 'b']] },
  { indent: 7, bars: [[16, 'g'], [38, 'y']] },
  { indent: 14, bars: [[34, 'b']] },
  { indent: 14, bars: [[20, 'p'], [16, 'g'], [14, 'y']] },
  { indent: 7, bars: [[28, 'y']] },
  { indent: 0, bars: [[12, 'b'], [36, 'p']] },
  { indent: 7, bars: [[44, 'g']] },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function WorkCard({ work }: { work: WorkCardItem }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pinRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  // タッチ端末はホバーできないので、カードが画面の中ほどに来たら開く
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia('(hover: none)').matches) return;
    const io = new IntersectionObserver(([e]) => setOpen(e.isIntersecting), {
      rootMargin: '-32% 0px -32% 0px',
      threshold: 0,
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  // 開いている間：視差と、引き出し線（ラベル→各層）の追従
  useEffect(() => {
    const root = rootRef.current;
    const stack = stackRef.current;
    const svg = svgRef.current;
    if (!root || !stack || !svg) return;

    if (!open) {
      root.dataset.ready = '0';
      stack.style.setProperty('--px', '0');
      stack.style.setProperty('--py', '0');
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let readyAt = 0;
    let placed = false;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = root.getBoundingClientRect();
      tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1, 1);
      ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1, 1);
    };

    const placeLabels = () => {
      const rr = root.getBoundingClientRect();
      const ys = pinRefs.current.map((p) => (p ? p.getBoundingClientRect().top - rr.top : 0));
      for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + 38);
      const over = ys[ys.length - 1] - (rr.height - 36);
      if (over > 0) for (let i = 0; i < ys.length; i++) ys[i] -= over;
      labelRefs.current.forEach((l, i) => {
        if (l) l.style.top = `${ys[i] - l.offsetHeight / 2}px`;
      });
      svg.setAttribute('viewBox', `0 0 ${rr.width} ${rr.height}`);
      placed = true;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!reduce) {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        stack.style.setProperty('--px', cx.toFixed(3));
        stack.style.setProperty('--py', cy.toFixed(3));
      }
      // 動きが落ち着いてからラベルを出す
      if (!readyAt && now - t0 > (reduce ? 0 : 760)) {
        placeLabels();
        readyAt = now;
        root.dataset.ready = '1';
      }
      if (!placed) return;
      const k = reduce ? 1 : clamp((now - readyAt) / 420);
      const e = 1 - Math.pow(1 - k, 3);
      const rr = root.getBoundingClientRect();
      pinRefs.current.forEach((p, i) => {
        const l = labelRefs.current[i];
        const ln = lineRefs.current[i];
        const dot = dotRefs.current[i];
        if (!p || !l || !ln || !dot) return;
        const pr = p.getBoundingClientRect();
        const lr = l.getBoundingClientRect();
        const x2 = pr.left - rr.left;
        const y2 = pr.top - rr.top;
        const x1 = lr.left - rr.left - 6;
        const y1 = lr.top - rr.top + lr.height / 2;
        ln.setAttribute('x1', x1.toFixed(1));
        ln.setAttribute('y1', y1.toFixed(1));
        ln.setAttribute('x2', (x1 + (x2 - x1) * e).toFixed(1));
        ln.setAttribute('y2', (y1 + (y2 - y1) * e).toFixed(1));
        dot.setAttribute('cx', x2.toFixed(1));
        dot.setAttribute('cy', y2.toFixed(1));
        dot.style.opacity = k > 0.92 ? '1' : '0';
      });
    };

    root.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      root.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [open]);

  const { layers } = work;
  const labelOrder = [layers.release, layers.build, layers.design];
  const dotColor = ['pink', 'blue', 'yellow'] as const;
  const isVideo = Boolean(work.videoSrc);

  // ほぼ正方形の画像は、斜めにすると横に広がるので、小さめにして左へ寄せすぎない
  const squarish = work.ratio < 1.25;
  const stackStyle = {
    '--ratio': work.ratio,
    '--limit': isVideo ? 0.74 : 1,
    '--ox': squarish ? '-11%' : '-14%',
    '--os': squarish ? 0.63 : 0.67,
  } as CSSProperties;

  return (
    <Link
      href={work.href || `/works/${work.id}`}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setOpen(false);
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(':focus-visible')) setOpen(true);
      }}
      onBlur={() => setOpen(false)}
      className="group overflow-hidden bg-[#eceeee] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3be7ed]/70"
    >
      <div
        ref={rootRef}
        data-open={open ? '1' : '0'}
        data-ready="0"
        className={`${styles.root} relative aspect-square overflow-hidden bg-[#eceeee]`}
      >
        <div className={styles.stage}>
          <div ref={stackRef} className={styles.stack} style={stackStyle}>
            {/* 設計の層：ワイヤーフレーム */}
            <div className={`${styles.plate} ${styles.design}`} aria-hidden="true">
              <i className={styles.wfHeader} />
              <i className={styles.wfHero}>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
                  <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
                </svg>
              </i>
              <i className={styles.wfMark} />
              <i className={styles.wfCard} style={{ left: '6%' }} />
              <i className={styles.wfCard} style={{ left: '37%' }} />
              <i className={styles.wfCard} style={{ left: '68%' }} />
              <span ref={(el) => { pinRefs.current[2] = el; }} className={styles.pin} />
            </div>

            {/* 開発・実装の層：コードの棒 */}
            <div className={`${styles.plate} ${styles.build}`} aria-hidden="true">
              {CODE_LINES.map((ln, i) => (
                <div key={i} className={styles.codeLine} style={{ paddingLeft: `${ln.indent}%` }}>
                  {ln.bars.map(([w, c], j) => (
                    <b key={j} className={`${styles.bar} ${styles[`bar_${c}`]}`} style={{ width: `${w}%` }} />
                  ))}
                </div>
              ))}
              <span ref={(el) => { pinRefs.current[1] = el; }} className={styles.pin} />
            </div>

            {/* 公開の層：実際のサイト */}
            <div className={`${styles.plate} ${styles.screen}`}>
              {work.videoSrc ? (
                <video
                  src={work.videoSrc}
                  autoPlay
                  loop
                  muted
                  preload="metadata"
                  playsInline
                  className={styles.media}
                />
              ) : (
                <Image
                  src={work.imageSrc || work.thumbnail || ''}
                  alt={`${work.title} のプレビュー`}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className={styles.media}
                />
              )}
              <span ref={(el) => { pinRefs.current[0] = el; }} className={styles.pin} />
            </div>
          </div>
        </div>

        {/* 引き出し線とラベル */}
        <svg ref={svgRef} className={styles.leaders} aria-hidden="true">
          {labelOrder.map((_, i) => (
            <g key={i}>
              <line ref={(el) => { lineRefs.current[i] = el; }} />
              <circle ref={(el) => { dotRefs.current[i] = el; }} r="3.2" />
            </g>
          ))}
        </svg>
        {labelOrder.map((text, i) => (
          <span
            key={text + i}
            ref={(el) => { labelRefs.current[i] = el; }}
            aria-hidden="true"
            className={`${styles.label} bg-white/90 px-3 py-1.5 text-xs font-bold tracking-[0.12em] text-[#087f86] shadow-sm`}
          >
            <i className={`${styles.dot} ${styles[`dot_${dotColor[i]}`]}`} />
            {text}
          </span>
        ))}

        <Image
          src="/icons/up.png"
          alt=""
          aria-hidden="true"
          width={44}
          height={44}
          className={styles.ferret}
        />

        <span className="absolute left-5 top-5 z-10 bg-white/92 px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#087f86] shadow-sm">
          {work.category}
        </span>
      </div>

      <div className="flex min-h-[148px] flex-col bg-[#eceeee] px-6 pb-6 pt-1 text-[#172225]">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold">{work.title}</h3>
          <ArrowUpRight className="h-5 w-5 shrink-0 text-[#08aeb8]" aria-hidden="true" />
        </div>
        <p className="text-sm leading-7 text-[#4c585b]">{work.description}</p>
        <p className="mt-auto pt-5 text-xs font-bold tracking-[0.2em] text-[#08aeb8]">VIEW DETAIL</p>
      </div>
    </Link>
  );
}
