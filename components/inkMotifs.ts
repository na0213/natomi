/* 年表の線画（手描き風のインク）。原点＝中央線への取り付け位置、x は外向き、y は下向き。 */

export type MotifId = 'browser' | 'bubbles' | 'mountain' | 'sprout' | 'flask' | 'dolphin';
export type Pastel = 'pink' | 'rose' | 'blue' | 'green' | 'yellow';

export type Motif = {
  strokes: string[];                       // 一筆ごとのパス
  fills: { d: string; c: Pastel }[];       // 線のあとに乗るパステル（少しずらして重ねる）
  fix?: number[];                          // 左右反転しても向きを保つ筆（</> や >_ の文字）
};

/** サイトのイルカ・お花アイコンから取った色 */
export const INK = '#685040';
export const PASTEL: Record<Pastel, string> = {
  pink: '#f8c8c0',
  rose: '#f0a098',
  blue: '#b8e0f0',
  green: '#d0f0d0',
  yellow: '#f8e8a0',
};

const circ = (cx: number, cy: number, r: number) =>
  `M ${cx + r} ${cy} a ${r} ${r} 0 1 0 ${-2 * r} 0 a ${r} ${r} 0 1 0 ${2 * r} 0`;

const rr = (x0: number, y0: number, x1: number, y1: number, r: number) =>
  `M ${x0 + r} ${y0} L ${x1 - r} ${y0} Q ${x1} ${y0} ${x1} ${y0 + r} L ${x1} ${y1 - r} Q ${x1} ${y1} ${x1 - r} ${y1} L ${x0 + r} ${y1} Q ${x0} ${y1} ${x0} ${y1 - r} L ${x0} ${y0 + r} Q ${x0} ${y0} ${x0 + r} ${y0} Z`;

const helix = (x0: number, x1: number, cy: number, amp: number, wl: number, ph: number) => {
  let d = '';
  for (let x = x0; x <= x1; x += 2) {
    const y = cy + amp * Math.sin((2 * Math.PI * (x - x0)) / wl + ph);
    d += (d ? ' L ' : 'M ') + x + ' ' + y.toFixed(1);
  }
  return d;
};

const rungs = (x0: number, x1: number, cy: number, amp: number, wl: number) => {
  const out: string[] = [];
  for (let x = x0 + wl / 4; x <= x1; x += wl / 2) out.push(`M ${x} ${cy - amp} L ${x} ${cy + amp}`);
  return out;
};

/** 数字だけのパスを拡大・回転・移動する（M L C Q Z のみ対応） */
const xfPath = (d: string, o: { x: number; y: number; s: number; r: number }) => {
  const toks = d.match(/[MLCQZ]|-?\d*\.?\d+/g) ?? [];
  const out: string[] = [];
  let nums: number[] = [];
  const rad = (o.r * Math.PI) / 180;
  const c = Math.cos(rad);
  const n = Math.sin(rad);
  for (const t of toks) {
    if (/[MLCQZ]/.test(t)) {
      out.push(t);
      continue;
    }
    nums.push(parseFloat(t));
    if (nums.length === 2) {
      const px = nums[0] * o.s;
      const py = nums[1] * o.s;
      out.push((o.x + px * c - py * n).toFixed(1) + ' ' + (o.y + px * n + py * c).toFixed(1));
      nums = [];
    }
  }
  return out.join(' ');
};

const DOLPHIN =
  'M 12 0 C 8 12 2 28 -6 40 C 8 34 26 16 44 8 C 90 22 150 40 205 38 C 205 52 198 64 188 74 C 200 60 214 44 224 36 C 260 30 290 22 305 16 C 318 14 330 13 338 10 C 330 4 316 2 306 0 C 300 -20 282 -30 262 -32 C 235 -36 200 -40 178 -38 C 172 -56 160 -74 146 -84 C 150 -66 150 -48 138 -34 C 105 -26 68 -14 44 -6 C 26 -16 8 -34 -6 -40 C 2 -28 8 -12 12 0';
const dolphin = xfPath(DOLPHIN, { x: 50, y: -16, s: 0.36, r: -22 });

const CLOUD = 'M 98 -30 C 92 -30 90 -40 98 -41 C 98 -50 112 -52 116 -45 C 122 -52 136 -48 134 -40 C 142 -40 142 -30 134 -30 Z';
const BUBBLE_A =
  'M 28 -8 Q 28 -20 40 -20 L 92 -20 Q 104 -20 104 -8 L 104 8 Q 104 20 92 20 L 58 20 L 36 34 L 42 20 L 40 20 Q 28 20 28 8';
const BUBBLE_B =
  'M 92 14 L 131 14 Q 142 14 142 25 L 142 39 Q 142 50 131 50 L 128 50 L 134 62 L 114 50 L 91 50 Q 80 50 80 39 L 80 25 Q 80 14 91 14';

export const MOTIFS: Record<MotifId, Motif> = {
  // Web engineer
  browser: {
    fix: [5, 6, 7],
    strokes: [
      'M 0 0 L 28 0 L 28 -16 Q 28 -22 34 -22 L 122 -22 Q 128 -22 128 -16 L 128 34 Q 128 40 122 40 L 34 40 Q 28 40 28 34 L 28 0',
      'M 28 -8 L 128 -8',
      circ(37, -15, 2),
      circ(46, -15, 2),
      circ(55, -15, 2),
      'M 56 8 L 46 16 L 56 24',
      'M 72 25 L 80 7',
      'M 96 8 L 106 16 L 96 24',
      CLOUD,
    ],
    fills: [
      { d: rr(28, -22, 128, 40, 6), c: 'green' },
      { d: CLOUD, c: 'blue' },
    ],
  },
  // コミュニティマネージャー
  bubbles: {
    strokes: [
      'M 0 0 L 28 0 L 28 -8 Q 28 -20 40 -20 L 92 -20 Q 104 -20 104 -8 L 104 8 Q 104 20 92 20 L 58 20 L 36 34 L 42 20 L 40 20 Q 28 20 28 8 L 28 0',
      BUBBLE_B,
      circ(50, 0, 2.5),
      circ(66, 0, 2.5),
      circ(82, 0, 2.5),
      'M 111 41 C 100 34 104 25 111 30 C 118 25 122 34 111 41 Z',
    ],
    fills: [
      { d: BUBBLE_A + ' Z', c: 'yellow' },
      { d: BUBBLE_B + ' Z', c: 'pink' },
    ],
  },
  // 地域関連プログラム修了
  mountain: {
    strokes: [
      'M 0 0 L 132 0 L 92 -44 L 76 -34 L 64 -50 L 28 0',
      'M 64 -50 L 64 -76 L 84 -69 L 64 -62',
      circ(122, -62, 8),
      'M 122 -76 L 122 -73',
      'M 136 -62 L 133 -62',
      'M 112 -72 L 114 -70',
      'M 132 -72 L 130 -70',
      'M 52 -22 L 58 -28 L 62 -22',
      'M 98 -18 L 104 -26 L 108 -18',
    ],
    fills: [
      { d: 'M 28 0 L 64 -50 L 76 -34 L 92 -44 L 132 0 Z', c: 'green' },
      { d: 'M 64 -76 L 84 -69 L 64 -62 Z', c: 'pink' },
      { d: circ(122, -62, 8), c: 'yellow' },
    ],
  },
  // プログラミング講座
  sprout: {
    fix: [5, 6],
    strokes: [
      'M 0 8 L 32 8 L 88 8 L 82 42 Q 81 46 76 46 L 44 46 Q 39 46 38 42 L 32 8',
      'M 35 17 L 85 17',
      'M 60 8 C 60 -2 58 -10 58 -18',
      'M 58 -9 C 42 -11 34 -22 40 -32 C 52 -30 58 -22 58 -9',
      'M 58 -18 C 62 -36 82 -44 96 -36 C 94 -22 76 -14 58 -18',
      'M 52 26 L 60 32 L 52 38',
      'M 64 39 L 72 39',
    ],
    fills: [
      { d: 'M 32 8 L 88 8 L 82 42 Q 81 46 76 46 L 44 46 Q 39 46 38 42 Z', c: 'pink' },
      { d: 'M 58 -9 C 42 -11 34 -22 40 -32 C 52 -30 58 -22 58 -9 Z', c: 'green' },
      { d: 'M 58 -18 C 62 -36 82 -44 96 -36 C 94 -22 76 -14 58 -18 Z', c: 'green' },
    ],
  },
  // 研究補助・秘書
  flask: {
    strokes: [
      'M 0 0 L 47.5 0 L 52 -10 L 52 -34 L 76 -34 L 76 -10 L 100 36 Q 102 40 97 40 L 33 40 Q 28 40 31 36 L 47.5 0',
      'M 47 -34 L 81 -34',
      'M 36 22 q 8 -5 16 0 t 16 0 t 16 0 t 13 0',
      circ(58, 10, 2.6),
      circ(70, 2, 2),
      circ(62, -8, 2.4),
      circ(66, -22, 3),
    ],
    fills: [{ d: 'M 36 22 q 8 -5 16 0 t 16 0 t 16 0 t 13 0 L 98 36 Q 100 40 96 40 L 34 40 Q 29 40 32 36 Z', c: 'blue' }],
  },
  // 生物系 修士（海洋生物の遺伝学）
  dolphin: {
    strokes: [
      'M 0 0 L 28 0',
      helix(28, 148, 0, 7, 40, 0),
      helix(28, 148, 0, 7, 40, Math.PI),
      ...rungs(28, 148, 0, 7, 40),
      dolphin,
      circ(121, -54, 1.4),
    ],
    fills: [{ d: dolphin + ' Z', c: 'pink' }],
  },
};
