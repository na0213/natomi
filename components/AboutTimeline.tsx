'use client';

import { useEffect, useMemo, useRef, useState, Fragment } from 'react';
import styles from './AboutTimeline.module.css';

type Side = 'left' | 'right';

export type TimelineItem = {
  side: Side;
  range: string;      // 並び順用（YYYY/MM または YYYY/MM–YYYY/MM）
  period: string;     // 表示用（"2024年〜" など）
  title: string;
  description: string;
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
  const [progress, setProgress] = useState(0); // 0..1

  // 行ノード参照（同じ index = 同じ“月の行”）
  const leftRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const rightRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reached, setReached] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // 進捗線：早めに始め、遅めに終わる
      const start = rect.top - vh * 0.60;
      const end   = rect.bottom - vh * 0.10;
      const p = Math.min(1, Math.max(0, (0 - start) / (end - start)));
      setProgress(p);

      // 進捗線の現在Y（ページ座標）
      const containerTop = el.getBoundingClientRect().top + window.scrollY;
      const progressY = containerTop + (rect.height * p);

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
      setReached(next);
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
      <div className={styles.timeline}>
        {/* 中央線（背景＋進捗） */}
        <div className={styles.centerRail} />
        <div className={styles.centerProgress} style={{ height: `${progress * 100}%` }} />

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
