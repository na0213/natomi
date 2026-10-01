/* トップの住人たち。経歴・好きなものにちなんだ動物（海洋生物の研究、釣り、動物好き）。
   座標は体の中心が原点、y は下向き、体の半径がおよそ 42。 */

export type ActorId = 'dolphin' | 'whale' | 'tai' | 'penguin' | 'sloth' | 'cat' | 'dog';

export type ActorDef = {
  id: ActorId;
  r: number;                               // 基準の大きさに対する倍率
  ext: [number, number];                   // 絵が左右にはみ出す幅（体の中心から）
  strokes: string[];
  fills: { d: string; c: string }[];
  eyes: [number, number][];
  cheeks: [number, number][];
};

/** サイトのアイコンから取ったパステル */
export const COLORS: Record<string, string> = {
  pink: '#f8c8c0',
  rose: '#f0a098',
  blue: '#b8e0f0',
  sea: '#9fcbe3',
  slate: '#a9c7dc',
  green: '#d0f0d0',
  yellow: '#f8e8a0',
  cream: '#fbf1d6',
  peach: '#f8d9bd',
  brownp: '#e3c3a6',
  white: '#ffffff',
};

const el = (cx: number, cy: number, rx: number, ry: number) =>
  `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0 Z`;
const ROUND = 'M 0 -40 C 24 -40 40 -22 40 2 C 40 28 24 41 0 41 C -24 41 -40 28 -40 2 C -40 -22 -24 -40 0 -40 Z';

const DOLPHIN_BODY = 'M -30 2 C -30 -22 -6 -38 18 -34 C 38 -30 46 -12 44 8 C 42 28 22 40 -4 38 C -20 36 -30 22 -30 2 Z';
const DOLPHIN_SNOUT = 'M -30 4 C -42 2 -54 6 -58 12 C -56 20 -44 20 -30 16';
const DOLPHIN_FIN = 'M 6 -34 C 8 -50 20 -56 30 -52 C 22 -46 22 -36 24 -30';
const DOLPHIN_TAIL = 'M 42 4 C 52 2 56 -6 56 -16 C 48 -22 44 -30 46 -36 C 52 -32 56 -26 56 -22 C 56 -26 60 -32 66 -36 C 68 -30 64 -22 56 -16';
const DOLPHIN_FLIPPER = 'M -4 22 C -2 36 8 44 18 42 C 12 36 10 28 8 20';

const WHALE_BODY = 'M -40 4 C -40 -24 -18 -38 8 -36 C 32 -34 44 -14 42 10 C 40 32 20 42 -2 40 C -24 38 -40 28 -40 4 Z';
const WHALE_TAIL = 'M 36 22 C 52 22 60 6 56 -10 C 46 -14 42 -22 44 -30 C 50 -26 54 -22 56 -18 C 58 -24 62 -30 68 -32 C 70 -24 66 -14 56 -10';

const TAI_BODY = 'M -40 0 C -36 -22 -8 -34 16 -26 C 30 -20 36 -8 36 0 C 36 8 30 20 16 26 C -8 34 -36 22 -40 0 Z';
const TAI_TAIL = 'M 34 0 L 58 -22 C 53 -9 53 9 58 22 Z';
const TAI_DORSAL = 'M -12 -29 C -6 -46 20 -46 24 -26';
const TAI_FIN = 'M -2 28 C 0 40 12 42 16 38 C 10 36 10 30 12 26';

const PENGUIN_BODY = 'M 0 -44 C 24 -44 40 -24 40 4 C 40 30 24 44 0 44 C -24 44 -40 30 -40 4 C -40 -24 -24 -44 0 -44 Z';
const PENGUIN_BELLY = 'M 0 -24 C 18 -24 27 -6 27 12 C 27 32 15 40 0 40 C -15 40 -27 32 -27 12 C -27 -6 -18 -24 0 -24 Z';
const PENGUIN_BEAK = 'M -6 -12 Q 0 -17 6 -12 Q 0 -2 -6 -12 Z';
const PENGUIN_FL = 'M -38 0 C -52 8 -54 26 -44 32 C -39 24 -37 12 -38 0 Z';
const PENGUIN_FR = 'M 38 0 C 52 8 54 26 44 32 C 39 24 37 12 38 0 Z';

const SLOTH_PATCH = 'M -28 -20 C -28 -34 28 -34 28 -20 C 28 4 14 14 0 14 C -14 14 -28 4 -28 -20 Z';
const SLOTH_BAND_L = 'M -25 -17 C -25 -27 -9 -22 -5 -9 C -9 -3 -23 -7 -25 -17 Z';
const SLOTH_BAND_R = 'M 25 -17 C 25 -27 9 -22 5 -9 C 9 -3 23 -7 25 -17 Z';
const SLOTH_ARM_L = 'M -37 8 C -54 14 -54 36 -44 44 C -36 40 -34 26 -32 14';
const SLOTH_ARM_R = 'M 37 8 C 54 14 54 36 44 44 C 36 40 34 26 32 14';

const CAT_EAR_L = 'M -34 -16 L -32 -50 L -9 -35';
const CAT_EAR_R = 'M 34 -16 L 32 -50 L 9 -35';
const CAT_TAIL = 'M 36 22 C 56 28 64 6 54 -10 C 50 -4 52 8 44 14';

const DOG_EAR_L = 'M -30 -26 C -52 -26 -56 8 -44 20 C -34 18 -28 -4 -30 -26 Z';
const DOG_EAR_R = 'M 30 -26 C 52 -26 56 8 44 20 C 34 18 28 -4 30 -26 Z';
const DOG_MUZZLE = 'M -17 6 C -17 -4 17 -4 17 6 C 17 18 -17 18 -17 6 Z';

export const ACTORS: ActorDef[] = [
  {
    id: 'dolphin',
    ext: [60, 68],
    r: 1.0,
    strokes: [DOLPHIN_BODY, DOLPHIN_SNOUT, DOLPHIN_FIN, DOLPHIN_TAIL, DOLPHIN_FLIPPER, 'M -36 14 C -44 16 -52 16 -56 13'],
    fills: [
      { d: DOLPHIN_BODY, c: 'blue' },
      { d: 'M -26 14 C -14 32 18 38 38 20 C 30 36 8 42 -6 40 C -20 38 -26 28 -26 14 Z', c: 'white' },
      { d: DOLPHIN_SNOUT + ' Z', c: 'blue' },
      { d: DOLPHIN_FIN + ' Z', c: 'sea' },
      { d: DOLPHIN_TAIL + ' Z', c: 'sea' },
      { d: DOLPHIN_FLIPPER + ' Z', c: 'sea' },
    ],
    eyes: [[-22, -6]],
    cheeks: [[-14, 12]],
  },
  {
    id: 'whale',
    ext: [44, 70],
    r: 1.15,
    strokes: [
      WHALE_BODY,
      WHALE_TAIL,
      'M -6 -37 L -6 -49',
      'M -6 -49 C -14 -53 -18 -51 -20 -45',
      'M -6 -49 C 2 -53 6 -51 8 -45',
      el(-22, -42, 1.8, 1.8),
      el(10, -42, 1.8, 1.8),
      'M -22 26 C -12 30 0 30 10 26',
      'M -14 32 C -6 35 4 35 12 32',
      'M -38 8 C -30 16 -16 16 -10 10',
    ],
    fills: [
      { d: WHALE_BODY, c: 'sea' },
      { d: 'M -36 16 C -26 34 14 44 38 22 C 32 38 10 44 -4 42 C -22 40 -34 30 -36 16 Z', c: 'white' },
      { d: WHALE_TAIL + ' Z', c: 'sea' },
    ],
    eyes: [[-20, -6]],
    cheeks: [[-28, 6]],
  },
  {
    id: 'tai',
    ext: [42, 60],
    r: 0.9,
    strokes: [
      TAI_BODY,
      TAI_TAIL,
      TAI_DORSAL,
      TAI_FIN,
      'M 4 -14 C 10 -10 10 -4 4 0',
      'M 4 0 C 10 4 10 10 4 14',
      'M 18 -8 C 24 -4 24 2 18 6',
      'M -16 -14 C -22 -4 -22 6 -16 16',
      'M -40 2 C -37 5 -34 5 -32 3',
    ],
    fills: [
      { d: TAI_BODY, c: 'pink' },
      { d: TAI_TAIL, c: 'rose' },
      { d: TAI_DORSAL + ' Z', c: 'rose' },
      { d: TAI_FIN + ' Z', c: 'rose' },
    ],
    eyes: [[-27, -5]],
    cheeks: [[-22, 8]],
  },
  {
    id: 'penguin',
    ext: [54, 54],
    r: 0.95,
    strokes: [PENGUIN_BODY, PENGUIN_BELLY, PENGUIN_BEAK, PENGUIN_FL, PENGUIN_FR, el(-14, 45, 10, 4.5), el(14, 45, 10, 4.5)],
    fills: [
      { d: PENGUIN_BODY, c: 'slate' },
      { d: PENGUIN_BELLY, c: 'white' },
      { d: PENGUIN_BEAK, c: 'yellow' },
      { d: PENGUIN_FL, c: 'slate' },
      { d: PENGUIN_FR, c: 'slate' },
      { d: el(-14, 45, 10, 4.5), c: 'yellow' },
      { d: el(14, 45, 10, 4.5), c: 'yellow' },
    ],
    eyes: [[-12, -21], [12, -21]],
    cheeks: [[-21, -7], [21, -7]],
  },
  {
    id: 'sloth',
    ext: [54, 54],
    r: 1.0,
    strokes: [
      ROUND,
      SLOTH_PATCH,
      SLOTH_BAND_L,
      SLOTH_BAND_R,
      el(0, -1, 4.2, 3),
      'M -8 6 C -4 10 4 10 8 6',
      SLOTH_ARM_L,
      SLOTH_ARM_R,
      'M -50 41 L -52 49',
      'M -45 44 L -46 52',
      'M 50 41 L 52 49',
      'M 45 44 L 46 52',
      'M -6 -41 C -4 -47 0 -49 2 -43 C 4 -49 8 -47 8 -41',
    ],
    fills: [
      { d: ROUND, c: 'peach' },
      { d: SLOTH_PATCH, c: 'cream' },
      { d: SLOTH_BAND_L, c: 'brownp' },
      { d: SLOTH_BAND_R, c: 'brownp' },
      { d: el(0, -1, 4.2, 3), c: 'brownp' },
      { d: SLOTH_ARM_L + ' Z', c: 'peach' },
      { d: SLOTH_ARM_R + ' Z', c: 'peach' },
    ],
    eyes: [[-12, -13], [12, -13]],
    cheeks: [[-21, 5], [21, 5]],
  },
  {
    id: 'cat',
    ext: [46, 64],
    r: 0.92,
    strokes: [
      ROUND,
      CAT_EAR_L,
      CAT_EAR_R,
      'M -30 -26 L -29 -40 L -18 -33 Z',
      'M 30 -26 L 29 -40 L 18 -33 Z',
      'M -3 6 L 3 6 L 0 10 Z',
      'M 0 10 C 0 15 -6 16 -9 12',
      'M 0 10 C 0 15 6 16 9 12',
      'M -24 8 L -44 4',
      'M -24 13 L -44 15',
      'M 24 8 L 44 4',
      'M 24 13 L 44 15',
      'M 0 -37 L 0 -28',
      'M -9 -36 L -7 -28',
      'M 9 -36 L 7 -28',
      CAT_TAIL,
    ],
    fills: [
      { d: ROUND, c: 'cream' },
      { d: CAT_EAR_L + ' Z', c: 'cream' },
      { d: CAT_EAR_R + ' Z', c: 'cream' },
      { d: 'M -30 -26 L -29 -40 L -18 -33 Z', c: 'pink' },
      { d: 'M 30 -26 L 29 -40 L 18 -33 Z', c: 'pink' },
      { d: 'M -3 6 L 3 6 L 0 10 Z', c: 'rose' },
      { d: CAT_TAIL + ' Z', c: 'cream' },
    ],
    eyes: [[-14, -3], [14, -3]],
    cheeks: [[-25, 7], [25, 7]],
  },
  {
    id: 'dog',
    ext: [56, 56],
    r: 1.0,
    strokes: [
      ROUND,
      DOG_EAR_L,
      DOG_EAR_R,
      DOG_MUZZLE,
      el(0, 2, 5.4, 3.6),
      'M 0 6 L 0 10',
      'M 0 10 C -2 14 -8 14 -9 10',
      'M 0 10 C 2 14 8 14 9 10',
      'M -3 13 C -3 21 3 21 3 13',
      'M 38 16 C 52 14 58 4 54 -6',
    ],
    fills: [
      { d: ROUND, c: 'peach' },
      { d: DOG_EAR_L, c: 'brownp' },
      { d: DOG_EAR_R, c: 'brownp' },
      { d: DOG_MUZZLE, c: 'white' },
      { d: el(0, 2, 5.4, 3.6), c: 'brownp' },
      { d: 'M -3 13 C -3 21 3 21 3 13 Z', c: 'pink' },
    ],
    eyes: [[-15, -12], [15, -12]],
    cheeks: [[-27, 3], [27, 3]],
  },
];

/** 絵の外接枠（スプライト用の余白込み） */
export const SPRITE_BOX = { x0: -74, y0: -64, w: 150, h: 130 };
