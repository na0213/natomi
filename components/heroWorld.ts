/* トップの背景：手描きの線画の世界（山・丘・太陽・雲・木・お花）。
   画面の大きさに合わせてパスを組み立てる。layer: far=遠景（ゆっくり動く）, near=近景 */

export type WorldItem = {
  layer: 'far' | 'near';
  delay: number;                           // 描きはじめの秒
  dur: number;                             // 描き終わるまでの秒
  strokes: string[];
  fills: { d: string; c: string }[];
  lw?: number;                             // 線の太さ
};

export const WORLD_COLORS: Record<string, string> = {
  mist: '#dcecf1',
  snow: '#ffffff',
  hillBack: '#cdeccd',
  hillFront: '#dcf3d3',
  grass: '#d4efc9',
  tree: '#bfe6c0',
  sun: '#f8e8a0',
  cloud: '#ffffff',
  flag: '#f8c8c0',
  pink: '#f8c8c0',
  blue: '#b8e0f0',
  yellow: '#f8e8a0',
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const f = (n: number) => n.toFixed(1);
const rnd = (i: number) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
const pts2d = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'} ${f(p[0])} ${f(p[1])}`).join(' ');
const circle = (cx: number, cy: number, r: number) =>
  `M ${f(cx + r)} ${f(cy)} a ${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0 a ${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0 Z`;

export function buildWorld(W: number, H: number) {
  const s = clamp(Math.min(W / 1000, H / 760), 0.55, 1.25);
  const groundY = H - clamp(H * 0.13, 58, 128);
  const items: WorldItem[] = [];

  /* ---------- 遠景 ---------- */
  const mountain = (cx: number, hw: number, hm: number, baseY: number, delay: number): WorldItem => {
    const outline = `M ${f(cx - hw)} ${f(baseY)} Q ${f(cx - hw * 0.35)} ${f(baseY - hm * 0.5)} ${f(cx)} ${f(baseY - hm)} Q ${f(cx + hw * 0.35)} ${f(baseY - hm * 0.5)} ${f(cx + hw)} ${f(baseY)}`;
    const cap: [number, number][] = [
      [cx, baseY - hm],
      [cx - 0.237 * hw, baseY - 0.7 * hm],
      [cx - 0.13 * hw, baseY - 0.62 * hm],
      [cx - 0.04 * hw, baseY - 0.72 * hm],
      [cx + 0.06 * hw, baseY - 0.6 * hm],
      [cx + 0.15 * hw, baseY - 0.69 * hm],
      [cx + 0.237 * hw, baseY - 0.7 * hm],
    ];
    return {
      layer: 'far',
      delay,
      dur: 1.1,
      strokes: [outline, pts2d(cap.slice(1))],
      fills: [
        { d: outline + ' Z', c: 'mist' },
        { d: pts2d(cap) + ' Z', c: 'snow' },
      ],
    };
  };

  const hmBase = groundY - 0.07 * H;
  const m1x = W * (W < 600 ? 0.36 : 0.3);
  const m1hw = clamp(W * 0.25, 110, 340);
  const m1hm = clamp(H * 0.36, 130, 330);
  items.push(mountain(m1x, m1hw, m1hm, hmBase, 0.35));
  items.push(mountain(W * (W < 600 ? 0.8 : 0.68), m1hw * 0.74, m1hm * 0.7, hmBase, 0.5));

  // 山頂の旗
  const px = m1x;
  const py = hmBase - m1hm;
  items.push({
    layer: 'far',
    delay: 1.35,
    dur: 0.4,
    strokes: [
      `M ${f(px)} ${f(py)} L ${f(px)} ${f(py - 36 * s)}`,
      `M ${f(px)} ${f(py - 36 * s)} L ${f(px + 24 * s)} ${f(py - 29 * s)} L ${f(px)} ${f(py - 22 * s)}`,
    ],
    fills: [{ d: `M ${f(px)} ${f(py - 36 * s)} L ${f(px + 24 * s)} ${f(py - 29 * s)} L ${f(px)} ${f(py - 22 * s)} Z`, c: 'flag' }],
  });

  // 太陽
  const sunR = 30 * s;
  const sunX = W * 0.83;
  const sunY = Math.max(H * 0.2, 132 * s + 20);
  const rays: string[] = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.2;
    rays.push(
      `M ${f(sunX + Math.cos(a) * (sunR + 7))} ${f(sunY + Math.sin(a) * (sunR + 7))} L ${f(sunX + Math.cos(a) * (sunR + 17 * s))} ${f(sunY + Math.sin(a) * (sunR + 17 * s))}`
    );
  }
  items.push({
    layer: 'far',
    delay: 0.75,
    dur: 0.7,
    strokes: [circle(sunX, sunY, sunR), ...rays],
    fills: [{ d: circle(sunX, sunY, sunR), c: 'sun' }],
  });

  // 雲
  const cloud = (cx: number, cy: number, w: number, delay: number): WorldItem => {
    const k = w / 112;
    const l = cx - w / 2;
    const b = cy;
    const P = (x: number, y: number) => `${f(l + x * k)} ${f(b + y * k)}`;
    const d = `M ${P(0, 0)} C ${P(-10, -10)} ${P(0, -24)} ${P(16, -22)} C ${P(16, -40)} ${P(44, -44)} ${P(52, -28)} C ${P(62, -40)} ${P(92, -34)} ${P(90, -14)} C ${P(110, -12)} ${P(112, 0)} ${P(96, 0)} Z`;
    return { layer: 'far', delay, dur: 0.7, strokes: [d], fills: [{ d, c: 'cloud' }] };
  };
  const cloudY = Math.max(H * 0.18, 112 * s + 26);
  items.push(cloud(W * 0.14, cloudY + 8, 120 * s, 0.95));
  items.push(cloud(W * (W < 600 ? 0.58 : 0.52), cloudY - 10 * s, 96 * s, 1.1));
  if (W > 900) items.push(cloud(W * 0.93, cloudY + 70 * s, 100 * s, 1.2));

  /* ---------- 近景 ---------- */
  const hillFn = (base: number, A1: number, w1: number, p1: number, A2: number, w2: number, p2: number) => (x: number) =>
    base - A1 * (0.5 + 0.5 * Math.sin((x * 2 * Math.PI) / w1 + p1)) - A2 * Math.sin((x * 2 * Math.PI) / w2 + p2);
  const hillPts = (fn: (x: number) => number) => {
    const pts: [number, number][] = [];
    for (let x = -24; x <= W + 24; x += 12) pts.push([x, fn(x)]);
    return pts;
  };
  const closeDown = (pts: [number, number][]) => `${pts2d(pts)} L ${f(W + 24)} ${f(H + 30)} L -24 ${f(H + 30)} Z`;

  const backFn = hillFn(groundY - 0.085 * H, 0.07 * H, W * 0.9, 0.4, 0.012 * H, W * 0.33, 1.2);
  const backPts = hillPts(backFn);
  items.push({
    layer: 'near',
    delay: 0.25,
    dur: 1.1,
    strokes: [pts2d(backPts)],
    fills: [{ d: closeDown(backPts), c: 'hillBack' }],
  });

  // 木
  const tree = (x: number, size: number, delay: number): WorldItem => {
    const y = backFn(x) + 6;
    const cy = y - 30 * size;
    return {
      layer: 'near',
      delay,
      dur: 0.5,
      strokes: [`M ${f(x)} ${f(y)} L ${f(x)} ${f(y - 22 * size)}`, circle(x, cy, 21 * size)],
      fills: [{ d: circle(x, cy, 21 * size), c: 'tree' }],
    };
  };
  items.push(tree(W * 0.08, 1.0 * s, 1.2));
  items.push(tree(W * 0.135, 0.72 * s, 1.3));
  items.push(tree(W * 0.9, 0.9 * s, 1.25));
  if (W > 700) items.push(tree(W * 0.56, 0.6 * s, 1.35));

  const frontFn = hillFn(groundY - 0.012 * H, 0.03 * H, W * 0.7, 2.2, 0.008 * H, W * 0.23, 0.4);
  const frontPts = hillPts(frontFn);
  items.push({
    layer: 'near',
    delay: 0.5,
    dur: 1.0,
    strokes: [pts2d(frontPts)],
    fills: [{ d: closeDown(frontPts), c: 'hillFront' }],
  });

  // 地面
  const groundPts: [number, number][] = [];
  for (let x = -24; x <= W + 24; x += 12) groundPts.push([x, groundY + 2.2 * Math.sin(x / 53) + 1.4 * Math.sin(x / 17 + 1.3)]);
  items.push({
    layer: 'near',
    delay: 0.1,
    dur: 1.0,
    strokes: [pts2d(groundPts)],
    fills: [{ d: closeDown(groundPts), c: 'grass' }],
  });

  // 草
  const tufts = Math.round(W / 70);
  for (let i = 0; i < tufts; i++) {
    const x = (i + 0.2 + rnd(i) * 0.6) * (W / tufts);
    const y = groundY + 4 + rnd(i + 9) * 10;
    const h = (7 + rnd(i + 3) * 5) * s;
    items.push({
      layer: 'near',
      delay: 1.3 + i * 0.03,
      dur: 0.35,
      strokes: [`M ${f(x - 5 * s)} ${f(y - h)} Q ${f(x - 2 * s)} ${f(y - h * 0.3)} ${f(x)} ${f(y)} Q ${f(x + 1 * s)} ${f(y - h * 1.1)} ${f(x + 2 * s)} ${f(y - h * 1.2)} M ${f(x)} ${f(y)} Q ${f(x + 3 * s)} ${f(y - h * 0.3)} ${f(x + 6 * s)} ${f(y - h * 0.8)}`],
      fills: [],
    });
  }

  // お花（サイトのお花アイコンにあわせて、ピンク・青・黄色）
  const colors = ['pink', 'blue', 'yellow', 'pink', 'yellow', 'blue'];
  const nF = Math.round(clamp(W / 120, 4, 12));
  for (let i = 0; i < nF; i++) {
    const x = (i + 0.3 + rnd(i + 21) * 0.5) * (W / nF);
    const y = groundY + 22 * s + rnd(i + 5) * 24 * s;
    const r = (5.2 + rnd(i + 7) * 2.6) * s;
    const strokes: string[] = [];
    for (let p = 0; p < 5; p++) {
      const a = (p / 5) * Math.PI * 2 - Math.PI / 2;
      strokes.push(circle(x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95, r * 0.66));
    }
    strokes.push(circle(x, y, r * 0.42));
    items.push({
      layer: 'near',
      delay: 1.4 + i * 0.07,
      dur: 0.4,
      lw: 1.5,
      strokes,
      fills: [
        ...strokes.slice(0, 5).map((d) => ({ d, c: colors[i % colors.length] })),
        { d: circle(x, y, r * 0.42), c: 'sun' },
      ],
    });
  }

  return { items, groundY, scale: s };
}
