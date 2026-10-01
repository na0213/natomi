'use client';

import { useEffect, useMemo, useRef, useState, Fragment } from 'react';
import styles from './AboutTimeline.module.css';
import { createInkTimeline, type InkTimeline, type RowInfo } from './inkEngine';
import type { MotifId } from './inkMotifs';

type Side = 'left' | 'right';

export type TimelineItem = {
  side: Side;
  range: string;      // 並び順用（YYYY/MM または YYYY/MM–YYYY/MM）
  period: string;     // 表示用（"2024年〜" など）
  title: string;
  description: string;
  motif?: MotifId;    // 年表の線画（空いている側に描く）
};

/* ======= ユーティリティ ======= */
const ymToNum = (ym: string) => {
  const m = ym.match(/^(\d{4})[\/\-\.](\d{1,2})$/);
  if (!m) return -Infinity;
  const y = Number(m[1]);
  const mm = Number(m[2]);
  return y * 12 + (mm - 1); // 0基準の通し月
};

// "2025/05" | "2023/12–2024/04" | "2023/12〜2024/04" | "2023/12-2024/04"
const parseRange = (range: string) => {
  const sep = range.includes('〜') ? '〜'
           : range.includes('–') ? '–'
           : range.includes('-') ? '-'
           : null;

  if (!sep) {
    const v = ymToNum(range.trim());
    return { start: v, end: v, latest: v, label: range };
  }
  const [a, b] = range.split(sep).map(s => s.trim());
  const s = ymToNum(a);
  const e = ymToNum(b);
  const start = Math.min(s, e);
  const end = Math.max(s, e);
  return { start, end, latest: end, label: range.replace(/-/g, '–') };
};

/* ======= メイン ======= */
export default function AboutTimeline({ items }: { items: TimelineItem[] }) {
  // メタ付与
  const enriched = useMemo(() => {
    return items.map(it => ({ ...it, meta: parseRange(it.range) }));
  }, [items]);

  // 並び順キー：最新月（通し月）を一意にして降順
  const orderKeys = useMemo(() => {
    const months = enriched.map(it => it.meta.latest);
    return Array.from(new Set(months)).sort((a, b) => b - a); // 新しい → 古い
  }, [enriched]);

  // 左右マップ（latest month → item）
  const leftMap = useMemo(() => {
    const m = new Map<number, (typeof enriched)[number]>();
    // 同じ月に複数来た場合は“後勝ち”で上書き（実データ的に月被りはほぼ無し）
    enriched.forEach(it => { if (it.side === 'left') m.set(it.meta.latest, it); });
    return m;
  }, [enriched]);

  const rightMap = useMemo(() => {
    const m = new Map<number, (typeof enriched)[number]>();
    enriched.forEach(it => { if (it.side === 'right') m.set(it.meta.latest, it); });
    return m;
  }, [enriched]);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ferretRef = useRef<HTMLDivElement | null>(null);
  const inkRef = useRef<InkTimeline | null>(null);
  const progressYRef = useRef(0); // 進捗線の現在Y（ページ座標）

  // 行ノード参照（同じ index = 同じ“月の行”）
  const leftRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reached, setReached] = useState<Record<string, boolean>>({});

  // 一本線の手描きインク（Canvas）。レイアウトを測って線画の置き場所を決める
  useEffect(() => {
    const tl = timelineRef.current;
    const canvas = canvasRef.current;
    const ferret = ferretRef.current;
    if (!tl || !canvas || !ferret) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ink = createInkTimeline({ canvas, ferret, reduce });
    inkRef.current = ink;

    const syncProgress = () => {
      const top = tl.getBoundingClientRect().top + window.scrollY;
      ink.setAnchor(progressYRef.current - top);
    };

    const layout = () => {
      const w = tl.clientWidth;
      const h = tl.clientHeight;
      if (w < 10 || h < 10) return; // スマホでは年表自体を表示しない
      const tr = tl.getBoundingClientRect();
      const titleY = (cell: HTMLElement | null) => {
        const t = cell?.querySelector('h4');
        if (!t) return undefined;
        const b = t.getBoundingClientRect();
        return b.top - tr.top + b.height / 2;
      };
      const rows: RowInfo[] = orderKeys.map((k, idx) => {
        const L = leftRefs.current[idx];
        const R = rightRefs.current[idx];
        const lItem = leftMap.get(k);
        const rItem = rightMap.get(k);
        const base = (L ?? R)!.getBoundingClientRect();
        const only = lItem && !rItem ? lItem : rItem && !lItem ? rItem : undefined;
        return {
          top: base.top - tr.top,
          height: base.height,
          leftY: lItem ? titleY(L) : undefined,
          rightY: rItem ? titleY(R) : undefined,
          motif: only?.motif,
          doodleSide: only ? (lItem ? 'R' : 'L') : undefined,
        };
      });
      ink.layout(w, h, rows);
      syncProgress();
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(tl);
    document.fonts?.ready.then(layout);
    return () => {
      ro.disconnect();
      ink.destroy();
      inkRef.current = null;
    };
  }, [orderKeys, leftMap, rightMap]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      // 進捗線の現在Y（ページ座標）：画面の少し下寄りを「いま読んでいる位置」とみなす
      const progressY = window.scrollY + window.innerHeight * 0.62;

      // 手描きの線も同じ位置まで進める（下線と同期）
      progressYRef.current = progressY;
      const tl = timelineRef.current;
      if (tl) {
        const tlTop = tl.getBoundingClientRect().top + window.scrollY;
        inkRef.current?.setAnchor(progressY - tlTop);
      }

      // 各行の“上から15%”を超えたら下線オン
      const next: Record<string, boolean> = {};
      orderKeys.forEach((_, idx) => {
        const L = leftRefs.current[idx];
        const R = rightRefs.current[idx];
        if (L) {
          const r = L.getBoundingClientRect();
          const triggerY = r.top + window.scrollY + r.height * 0.15;
          next[`L-${idx}`] = progressY >= triggerY;
        }
        if (R) {
          const r = R.getBoundingClientRect();
          const triggerY = r.top + window.scrollY + r.height * 0.15;
          next[`R-${idx}`] = progressY >= triggerY;
        }
      });
      setReached(prev => {
        const keys = Object.keys(next);
        return keys.length === Object.keys(prev).length && keys.every(k => prev[k] === next[k]) ? prev : next;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [orderKeys]);

  return (
    <section className={styles.wrap} ref={sectionRef}>
      {/* 見出し */}
        <div className={styles.heads}>
        <h3 className={styles.hLeft}>
            <img src="/icons/pink.png" alt="" aria-hidden="true" className={styles.headIcon} />
            しごと
        </h3>
        <h3 className={styles.hRight}>
            <img src="/icons/green.png" alt="" aria-hidden="true" className={styles.headIcon} />
            かつどう
        </h3>
        </div>

      {/* タイムライン本体 */}
      <div className={styles.timeline} ref={timelineRef}>
        {/* 中央線（下書きの薄い線）。この上を、手描きのインクとフェレットが進む */}
        <div className={styles.centerRail} />
        <canvas ref={canvasRef} className={styles.ink} aria-hidden="true" />
        <div ref={ferretRef} className={styles.ferret} aria-hidden="true">
          <img src="/icons/up.png" alt="" width={46} height={46} className="animate-slow-bounce" />
        </div>

        {/* 月ごとの行（左 | 溝 | 右） */}
        <div className={styles.rows}>
          {orderKeys.map((k, idx) => {
            const L = leftMap.get(k);
            const R = rightMap.get(k);

            return (
              <Fragment key={`row-${k}`}>
                <div
                  ref={(el) => { leftRefs.current[idx] = el; }}
                  className={L ? styles.row : styles.rowSpacer}
                >
                  {L && (
                    <>
                      <div className={styles.meta}>{L.period}</div>
                      <h4 className={styles.titleLeft}>{L.title || '(未設定)'}</h4>
                      <p className={styles.desc}>{L.description}</p>
                      <span
                        aria-hidden
                        className={`${styles.underline} ${styles.uLeft} ${reached[`L-${idx}`] ? styles.reached : ''}`}
                      />
                    </>
                  )}
                </div>

                <div className={styles.gutter} aria-hidden />

                <div
                  ref={(el) => { rightRefs.current[idx] = el; }}
                  className={R ? styles.row : styles.rowSpacer}
                >
                  {R && (
                    <>
                      <div className={styles.meta}>{R.period}</div>
                      <h4 className={styles.titleRight}>{R.title || '(未設定)'}</h4>
                      <p className={styles.desc}>{R.description}</p>
                      <span
                        aria-hidden
                        className={`${styles.underline} ${styles.uRight} ${reached[`R-${idx}`] ? styles.reached : ''}`}
                      />
                    </>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
