'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import styles from './WorkCard.module.css';

/** 重ねて見せる、実際のページ（画面）。label はそのサイト／アプリの中にある言葉 */
export type WorkLayer = { label: string; src: string };

export type WorkCardItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  videoSrc?: string;
  imageSrc?: string;
  thumbnail?: string;
  href?: string;
  external?: boolean;            // 詳細ページを挟まず、公開中のサイトを新しいタブで開く
  ratio: number;                 // メディアの縦横比（幅/高さ）
  /** 指定すると、ホバーでページが層になって開く。なければ従来どおりの1枚表示 */
  layers?: { top: string; mid: WorkLayer; bottom: WorkLayer };
  phone?: boolean;               // スマホ画面（角を大きく丸める）
};

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
  const { layers } = work;

  // タッチ端末はホバーできないので、カードが画面の中ほどに来たら開く
  useEffect(() => {
    const root = rootRef.current;
    if (!layers || !root || !window.matchMedia('(hover: none)').matches) return;
    const io = new IntersectionObserver(([e]) => setOpen(e.isIntersecting), {
      rootMargin: '-32% 0px -32% 0px',
      threshold: 0,
    });
    io.observe(root);
    return () => io.disconnect();
  }, [layers]);

  // 開いている間：視差と、引き出し線（ラベル→各層）の追従
  useEffect(() => {
    const root = rootRef.current;
    const stack = stackRef.current;
    const svg = svgRef.current;
    if (!layers || !root || !stack || !svg) return;

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
  }, [open, layers]);

  const isVideo = Boolean(work.videoSrc);
  const tall = work.ratio < 0.8;           // スマホ画面
  const squarish = work.ratio >= 0.8 && work.ratio < 1.25;
  const stackStyle = {
    '--ratio': work.ratio,
    '--limit': isVideo ? 0.74 : 1,
    '--ox': tall ? '-9%' : squarish ? '-11%' : '-14%',
    '--os': tall ? 0.8 : squarish ? 0.63 : 0.67,
    '--rad': work.phone ? '22px' : '8px',
    '--radc': work.phone ? '22px' : '0px',
  } as CSSProperties;

  const labels = layers ? [layers.top, layers.mid.label, layers.bottom.label] : [];
  const dotColor = ['pink', 'blue', 'yellow'] as const;

  const media = work.videoSrc ? (
    <video src={work.videoSrc} autoPlay loop muted preload="metadata" playsInline className={styles.media} />
  ) : (
    <Image
      src={work.imageSrc || work.thumbnail || ''}
      alt={`${work.title} のプレビュー`}
      fill
      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
      className={styles.media}
    />
  );

  return (
    <Link
      href={work.href || `/works/${work.id}`}
      {...(work.external && { target: '_blank', rel: 'noopener noreferrer' })}
      onPointerEnter={(e) => {
        if (layers && e.pointerType === 'mouse') setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (layers && e.pointerType === 'mouse') setOpen(false);
      }}
      onFocus={(e) => {
        if (layers && e.currentTarget.matches(':focus-visible')) setOpen(true);
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
            {layers && (
              <>
                {/* 下の層：実際のページ */}
                <div className={`${styles.plate} ${styles.design}`} aria-hidden="true">
                  <Image src={layers.bottom.src} alt="" fill sizes="(min-width: 768px) 40vw, 80vw" className={styles.media} />
                  <span ref={(el) => { pinRefs.current[2] = el; }} className={styles.pin} />
                </div>
                <div className={`${styles.plate} ${styles.build}`} aria-hidden="true">
                  <Image src={layers.mid.src} alt="" fill sizes="(min-width: 768px) 40vw, 80vw" className={styles.media} />
                  <span ref={(el) => { pinRefs.current[1] = el; }} className={styles.pin} />
                </div>
              </>
            )}

            {/* いちばん上：いつものメディア */}
            <div className={`${styles.plate} ${styles.screen}`}>
              {media}
              <span ref={(el) => { pinRefs.current[0] = el; }} className={styles.pin} />
            </div>
          </div>
        </div>

        {layers && (
          <>
            {/* 引き出し線とラベル */}
            <svg ref={svgRef} className={styles.leaders} aria-hidden="true">
              {labels.map((_, i) => (
                <g key={i}>
                  <line ref={(el) => { lineRefs.current[i] = el; }} />
                  <circle ref={(el) => { dotRefs.current[i] = el; }} r="3.2" />
                </g>
              ))}
            </svg>
            {labels.map((text, i) => (
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

            <Image src="/icons/up.png" alt="" aria-hidden="true" width={44} height={44} className={styles.ferret} />
          </>
        )}

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
        <p className="mt-auto pt-5 text-xs font-bold tracking-[0.2em] text-[#08aeb8]">
          {work.external ? 'デモを開く' : 'VIEW DETAIL'}
        </p>
      </div>
    </Link>
  );
}
