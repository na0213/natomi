'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import styles from './SkillsSection.module.css';
import { ACTORS, COLORS, SPRITE_BOX, type ActorId } from './heroActors';

/* 「できること」の線画：スキルごとのアイコンと、カードの上からのぞく動物 */

export type SkillIconId = 'web' | 'aws' | 'writing' | 'genai' | 'quality' | 'logistics';

type IconDef = { strokes: string[]; fills: { d: string; c: string }[] };

const circ = (cx: number, cy: number, r: number) =>
  `M ${cx + r} ${cy} a ${r} ${r} 0 1 0 ${-2 * r} 0 a ${r} ${r} 0 1 0 ${2 * r} 0 Z`;
const box = (x0: number, y0: number, x1: number, y1: number) => `M ${x0} ${y0} H ${x1} V ${y1} H ${x0} Z`;
const star = (x: number, y: number, r: number) =>
  `M ${x} ${y - r} Q ${x} ${y} ${x + r} ${y} Q ${x} ${y} ${x} ${y + r} Q ${x} ${y} ${x - r} ${y} Q ${x} ${y} ${x} ${y - r} Z`;

const WINDOW = 'M 10 10 H 54 Q 58 10 58 14 V 50 Q 58 54 54 54 H 10 Q 6 54 6 50 V 14 Q 6 10 10 10 Z';
const CLOUD = 'M 16 46 C 6 46 4 32 14 30 C 13 18 30 13 35 23 C 40 16 54 20 52 32 C 62 33 61 46 50 46 Z';
const BOLT = 'M 35 24 L 26 38 L 32 38 L 29 51 L 40 35 L 34 35 L 38 24 Z';
const NOTE = 'M 12 8 H 42 Q 45 8 45 11 V 53 Q 45 56 42 56 H 12 Q 9 56 9 53 V 11 Q 9 8 12 8 Z';
const PENCIL = 'M 34 52 L 36 43 L 52 27 L 58 33 L 42 49 Z';
const ERASER = 'M 52 27 L 55 24 Q 57 22 60 25 Q 62 28 60 30 L 58 33 Z';
const HEAD = 'M 18 22 H 40 Q 46 22 46 28 V 46 Q 46 52 40 52 H 18 Q 12 52 12 46 V 28 Q 12 22 18 22 Z';
const BOTTLE = 'M 16 17 H 24 V 21 Q 32 23 32 31 V 52 Q 32 56 28 56 H 12 Q 8 56 8 52 V 31 Q 8 23 16 21 Z';
const LENS = circ(44, 34, 11);
const CARGO = box(4, 16, 38, 44);
const CAB = 'M 38 24 H 49 Q 51 24 52.5 26 L 59 34.5 Q 60 36 60 38 V 44 H 38 Z';
const CAB_WINDOW = 'M 42 28 H 48.5 L 54 35 H 42 Z';

const ICONS: Record<SkillIconId, IconDef> = {
  // Web開発：画面と、クリックするカーソル
  web: {
    strokes: [
      WINDOW,
      'M 6 21 H 58',
      circ(12, 15.5, 1.5),
      circ(18, 15.5, 1.5),
      circ(24, 15.5, 1.5),
      box(10, 25, 21, 50),
      box(26, 26, 52, 31),
      box(26, 35, 38, 49),
      'M 44 40 L 44 57 L 48.5 53 L 52 60 L 55.5 58.5 L 52 51.5 L 58 51 Z',
    ],
    fills: [
      { d: WINDOW, c: 'green' },
      { d: box(10, 25, 21, 50), c: 'blue' },
      { d: box(26, 26, 52, 31), c: 'yellow' },
      { d: box(26, 35, 38, 49), c: 'white' },
      { d: 'M 44 40 L 44 57 L 48.5 53 L 52 60 L 55.5 58.5 L 52 51.5 L 58 51 Z', c: 'white' },
    ],
  },
  // AWS / サーバレス：雲と、いなずま
  aws: {
    strokes: [CLOUD, BOLT],
    fills: [
      { d: CLOUD, c: 'blue' },
      { d: BOLT, c: 'yellow' },
    ],
  },
  // 取材・ライティング：ノートと鉛筆
  writing: {
    strokes: [
      NOTE,
      circ(9, 18, 2),
      circ(9, 30, 2),
      circ(9, 42, 2),
      'M 17 20 H 37',
      'M 17 29 H 37',
      'M 17 38 H 30',
      PENCIL,
      'M 34 52 L 36 43 L 42 49',
      ERASER,
    ],
    fills: [
      { d: NOTE, c: 'cream' },
      { d: PENCIL, c: 'blue' },
      { d: 'M 34 52 L 36 43 L 42 49 Z', c: 'peach' },
      { d: ERASER, c: 'pink' },
    ],
  },
  // 生成AI活用：ロボットと、きらきら
  genai: {
    strokes: [
      HEAD,
      'M 29 22 V 14',
      circ(29, 11, 3),
      'M 12 32 H 8 V 42 H 12',
      'M 46 32 H 50 V 42 H 46',
      circ(23, 34, 2.8),
      circ(35, 34, 2.8),
      'M 24 43 Q 29 47 34 43',
      star(53, 14, 7),
      star(58, 29, 4),
    ],
    fills: [
      { d: HEAD, c: 'blue' },
      { d: circ(29, 11, 3), c: 'yellow' },
      { d: circ(23, 34, 2.8), c: 'ink' },
      { d: circ(35, 34, 2.8), c: 'ink' },
      { d: star(53, 14, 7), c: 'yellow' },
      { d: star(58, 29, 4), c: 'yellow' },
    ],
  },
  // 品質管理：化粧品のボトルと、チェックする虫めがね
  quality: {
    strokes: [
      box(14, 9, 26, 17),
      BOTTLE,
      box(12, 35, 28, 47),
      LENS,
      'M 38.5 34.5 L 42.5 38.5 L 49.5 29.5',
      'M 52 42 L 60 50',
    ],
    fills: [
      { d: box(14, 9, 26, 17), c: 'blue' },
      { d: BOTTLE, c: 'pink' },
      { d: box(12, 35, 28, 47), c: 'cream' },
      { d: LENS, c: 'white' },
    ],
  },
  // 受発注・物流管理：荷物をはこぶトラック
  logistics: {
    strokes: [
      CARGO,
      box(14, 22, 28, 37),
      'M 21 22 V 28',
      CAB,
      CAB_WINDOW,
      circ(15, 49, 5),
      circ(49, 49, 5),
    ],
    fills: [
      { d: CARGO, c: 'yellow' },
      { d: box(14, 22, 28, 37), c: 'peach' },
      { d: CAB, c: 'blue' },
      { d: CAB_WINDOW, c: 'white' },
      { d: circ(15, 49, 5), c: 'white' },
      { d: circ(49, 49, 5), c: 'white' },
    ],
  },
};

const FILL: Record<string, string> = { ...COLORS, ink: '#4a3a30' };

/** 線が引かれて、あとから色が乗るアイコン */
export function SkillIcon({ id }: { id: SkillIconId }) {
  const def = ICONS[id];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      {def.fills.map((f, i) => (
        <path key={`f${i}`} data-f d={f.d} fill={FILL[f.c]} transform="translate(1.3 1.3)" />
      ))}
      {def.strokes.map((s, i) => (
        <path key={`s${i}`} data-s d={s} pathLength={1} style={{ '--k': i } as CSSProperties} />
      ))}
    </svg>
  );
}

/** カードの上からのぞく動物（トップの住人と同じ絵） */
export function ActorPeek({ id }: { id: ActorId }) {
  const a = ACTORS.find((x) => x.id === id);
  if (!a) return null;
  return (
    <svg viewBox={`${SPRITE_BOX.x0} ${SPRITE_BOX.y0} ${SPRITE_BOX.w} ${SPRITE_BOX.h}`} aria-hidden="true">
      {a.fills.map((f, i) => (
        <path key={`f${i}`} d={f.d} fill={COLORS[f.c]} transform="translate(1.4 1.4)" />
      ))}
      {a.strokes.map((s, i) => (
        <path key={`s${i}`} d={s} fill="none" stroke="#685040" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {a.cheeks.map((c, i) => (
        <ellipse key={`c${i}`} cx={c[0]} cy={c[1]} rx={5.4} ry={3.6} fill="rgba(240,160,152,.55)" />
      ))}
      {a.eyes.map((e, i) => (
        <g key={`e${i}`} className={styles.eye}>
          <ellipse cx={e[0]} cy={e[1]} rx={3.3} ry={3.7} fill="#4a3a30" />
          <circle cx={e[0] + 1} cy={e[1] - 1.2} r={1.1} fill="#fff" />
        </g>
      ))}
    </svg>
  );
}

/* ---------- 手描き風の枠線 ---------- */
function seeded(seed: number) {
  let x = (seed * 9301 + 49297) % 233280;
  return () => {
    x = (x * 9301 + 49297) % 233280;
    return x / 233280;
  };
}

/** 角丸の長方形を、ほんの少し揺らして一周する滑らかなパスにする */
function wobblyRect(w: number, h: number, r: number, seed: number) {
  const rnd = seeded(seed);
  const j = () => (rnd() - 0.5) * 2.4;
  const pts: [number, number][] = [];
  const step = 30;
  for (let x = r; x < w - r; x += step) pts.push([x, 0.6 + j()]);
  for (const a of [-60, -30, 0]) pts.push([w - r + r * Math.cos((a * Math.PI) / 180) + j() * 0.4, r + r * Math.sin((a * Math.PI) / 180) + j() * 0.4]);
  for (let y = r + step; y < h - r; y += step) pts.push([w - 0.6 + j(), y]);
  for (const a of [30, 60, 90]) pts.push([w - r + r * Math.cos((a * Math.PI) / 180) + j() * 0.4, h - r + r * Math.sin((a * Math.PI) / 180) + j() * 0.4]);
  for (let x = w - r - step; x > r; x -= step) pts.push([x, h - 0.6 + j()]);
  for (const a of [120, 150, 180]) pts.push([r + r * Math.cos((a * Math.PI) / 180) + j() * 0.4, h - r + r * Math.sin((a * Math.PI) / 180) + j() * 0.4]);
  for (let y = h - r - step; y > r; y -= step) pts.push([0.6 + j(), y]);
  for (const a of [210, 240, 270]) pts.push([r + r * Math.cos((a * Math.PI) / 180) + j() * 0.4, r + r * Math.sin((a * Math.PI) / 180) + j() * 0.4]);
  // 閉じたCatmull-Rom → ベジェ
  const n = pts.length;
  const P = (i: number) => pts[(i + n) % n];
  let d = `M ${P(0)[0].toFixed(1)} ${P(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** 親要素いっぱいに、手描きの枠を引く */
export function InkBorder({ seed }: { seed: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [d, setD] = useState('');
  const [size, setSize] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w < 20 || h < 20) return;
      setSize([w, h]);
      setD(wobblyRect(w, h, 16, seed));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [seed]);

  return (
    <svg ref={ref} className={styles.border} width={size[0]} height={size[1]} viewBox={`0 0 ${size[0] || 1} ${size[1] || 1}`} aria-hidden="true">
      {d && <path d={d} pathLength={1} />}
    </svg>
  );
}
