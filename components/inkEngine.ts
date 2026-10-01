/* 年表の「一本の線」を描くエンジン。スクロール量に合わせて、中央線・線画・お花・フェレットを描く。 */
import { INK, MOTIFS, PASTEL, type Motif, type MotifId, type Pastel } from './inkMotifs';

export type RowInfo = {
  top: number;               // 年表の上端からの距離
  height: number;
  leftY?: number;            // 左の項目タイトルの中心Y
  rightY?: number;           // 右の項目タイトルの中心Y
  motif?: MotifId;           // 空いている側に描く線画
  doodleSide?: 'L' | 'R';    // 線画を描く側（＝空いている側）
};

type StrokeS = { pts: number[]; S: number[]; len: number; start: number; fix: boolean };
type MotifS = {
  strokes: StrokeS[];
  total: number;
  box: [number, number, number, number];
  fills: { p: Path2D; c: Pastel }[];
  fixCx: number;
};

const NS = 'http://www.w3.org/2000/svg';
const STEP = 2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** 手描きの揺れ（中央線のX） */
const wobble = (y: number) => 2.2 * Math.sin(y / 46 + 0.6) + 1.2 * Math.sin(y / 17 + 2.3) + 0.5 * Math.sin(y / 6.3);

/* ---------- サンプリング ---------- */
function sampleAll(): Record<MotifId, MotifS> {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden';
  const meas = document.createElementNS(NS, 'path');
  svg.appendChild(meas);
  document.body.appendChild(svg);

  const out = {} as Record<MotifId, MotifS>;
  (Object.keys(MOTIFS) as MotifId[]).forEach((id, seed) => {
    const m: Motif = MOTIFS[id];
    let total = 0;
    const strokes: StrokeS[] = m.strokes.map((d, si) => {
      meas.setAttribute('d', d);
      const len = meas.getTotalLength();
      const n = Math.max(2, Math.ceil(len / STEP));
      const pts: number[] = [];
      const S: number[] = [];
      for (let i = 0; i <= n; i++) {
        const p = meas.getPointAtLength((len * i) / n);
        pts.push(p.x, p.y);
        S.push((len * i) / n);
      }
      // 法線方向にごく小さく揺らす
      for (let i = 0; i <= n; i++) {
        const a = Math.max(0, i - 1);
        const b = Math.min(n, i + 1);
        let tx = pts[2 * b] - pts[2 * a];
        let ty = pts[2 * b + 1] - pts[2 * a + 1];
        const l = Math.hypot(tx, ty) || 1;
        tx /= l;
        ty /= l;
        const s = S[i] + si * 53 + (seed + 1) * 17;
        const off = 0.55 * Math.sin(s / 19 + seed + 1) + 0.35 * Math.sin(s / 6.1 + (seed + 1) * 2);
        pts[2 * i] -= ty * off;
        pts[2 * i + 1] += tx * off;
      }
      const st: StrokeS = { pts, S, len, start: total, fix: !!m.fix?.includes(si) };
      total += len;
      return st;
    });

    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    let fx = 0;
    let fc = 0;
    strokes.forEach((s) => {
      for (let i = 0; i < s.pts.length; i += 2) {
        x0 = Math.min(x0, s.pts[i]);
        x1 = Math.max(x1, s.pts[i]);
        y0 = Math.min(y0, s.pts[i + 1]);
        y1 = Math.max(y1, s.pts[i + 1]);
        if (s.fix) {
          fx += s.pts[i];
          fc++;
        }
      }
    });
    out[id] = {
      strokes,
      total,
      box: [x0, y0, x1, y1],
      fills: m.fills.map((f) => ({ p: new Path2D(f.d), c: f.c })),
      fixCx: fc ? fx / fc : 0,
    };
  });

  document.body.removeChild(svg);
  return out;
}

/* ---------- 描画部品 ---------- */
function drawMotif(ctx: CanvasRenderingContext2D, m: MotifS, t: number, mirror: boolean, k: number) {
  const L = m.total * t;
  const fa = smooth(0.78, 1, t);
  if (fa > 0) {
    m.fills.forEach((f) => {
      ctx.save();
      ctx.globalAlpha = fa;
      ctx.translate(2.5, 2.5);
      ctx.fillStyle = PASTEL[f.c];
      ctx.fill(f.p);
      ctx.restore();
    });
  }
  ctx.strokeStyle = INK;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  let head: [number, number] | null = null;
  for (const s of m.strokes) {
    const lim = Math.min(s.len, L - s.start);
    if (lim <= 0) continue;
    ctx.save();
    if (mirror && s.fix) {
      ctx.translate(m.fixCx, 0);
      ctx.scale(-1, 1);
      ctx.translate(-m.fixCx, 0);
    }
    const n = s.pts.length / 2;
    const ke = Math.min(n - 1, Math.ceil((lim / s.len) * (n - 1)));
    for (let a = 1; a <= ke; a += 3) {
      const e = Math.min(ke, a + 3);
      ctx.beginPath();
      ctx.moveTo(s.pts[2 * (a - 1)], s.pts[2 * (a - 1) + 1]);
      for (let j = a; j <= e; j++) ctx.lineTo(s.pts[2 * j], s.pts[2 * j + 1]);
      ctx.lineWidth = (2.1 * (0.86 + 0.14 * Math.sin(s.S[a] / 17))) / k;
      ctx.stroke();
    }
    if (lim < s.len) {
      let hx = s.pts[2 * ke];
      const hy = s.pts[2 * ke + 1];
      if (mirror && s.fix) hx = 2 * m.fixCx - hx;
      head = [hx, hy];
    }
    ctx.restore();
  }
  if (head && t < 1) {
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(head[0], head[1], 2.6 / k, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, side: 'L' | 'R') {
  const petal = side === 'L' ? PASTEL.pink : PASTEL.green;
  const edge = side === 'L' ? PASTEL.rose : '#b8e8c0';
  const R = 4.7 * s;
  const D = 5.4 * s;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(side === 'L' ? 0.2 : -0.1);
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * D, Math.sin(a) * D, R, 0, Math.PI * 2);
    ctx.fillStyle = petal;
    ctx.fill();
    ctx.strokeStyle = edge;
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, 3 * s, 0, Math.PI * 2);
  ctx.fillStyle = '#f8e090';
  ctx.fill();
  ctx.strokeStyle = '#f8d890';
  ctx.stroke();
  ctx.restore();
}

/* ---------- 本体 ---------- */
export type InkTimeline = {
  layout: (w: number, h: number, rows: RowInfo[]) => void;
  /** 「いま読んでいる位置」の年表上端からの距離(px)。年表の外（下）に出ても、線画は描き切る */
  setAnchor: (y: number) => void;
  destroy: () => void;
};

export function createInkTimeline(opts: {
  canvas: HTMLCanvasElement;
  ferret: HTMLElement;
  reduce: boolean;
  spineX?: number;     // 指定すると、中央ではなくこの位置（px）に線を引く（スマホの縦リスト用）
}): InkTimeline {
  const { canvas, ferret, reduce } = opts;
  const ctx = canvas.getContext('2d')!;
  const motifs = sampleAll();

  let W = 0;
  let H = 0;
  let dpr = 1;
  let target = reduce ? 1e6 : -50;
  let shown = target;
  let dirty = true;
  let raf = 0;
  let spineY: number[] = [];
  let flowers: { x: number; y: number; side: 'L' | 'R' }[] = [];
  let doodles: { m: MotifS; x: number; y: number; mirror: boolean; k: number; start: number; span: number }[] = [];

  const spineX = (y: number) => (opts.spineX ?? W / 2) + wobble(y);

  function layout(w: number, h: number, rows: RowInfo[]) {
    W = w;
    H = h;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));

    spineY = [];
    for (let y = 0; y <= H; y += 3) spineY.push(y);

    flowers = [];
    doodles = [];
    rows.forEach((r) => {
      const both = r.leftY !== undefined && r.rightY !== undefined;
      if (r.leftY !== undefined) flowers.push({ x: spineX(r.leftY) - (both ? 12 : 0), y: r.leftY, side: 'L' });
      if (r.rightY !== undefined) flowers.push({ x: spineX(r.rightY) + (both ? 12 : 0), y: r.rightY, side: 'R' });
      if (r.motif && r.doodleSide) {
        const m = motifs[r.motif];
        const bh = m.box[3] - m.box[1];
        const k = Math.min(1, (r.height - 24) / bh);
        const cy = r.top + r.height / 2;
        const jy = cy - ((m.box[1] + m.box[3]) / 2) * k;
        doodles.push({ m, x: spineX(jy), y: jy, mirror: r.doodleSide === 'L', k, start: jy, span: Math.max(90, bh * 1.15) });
      }
    });
    dirty = true;
  }

  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const tip = shown;                     // 読み進めた位置（年表の下に出ることもある）
    const tipY = clamp(tip, 0, H);         // 中央線・フェレットは年表の中にとどまる

    // 中央線
    ctx.strokeStyle = INK;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const last = Math.min(spineY.length - 1, Math.floor(tipY / 3));
    for (let a = 1; a <= last; a += 4) {
      const e = Math.min(last, a + 4);
      ctx.beginPath();
      ctx.moveTo(spineX(spineY[a - 1]), spineY[a - 1]);
      for (let j = a; j <= e; j++) ctx.lineTo(spineX(spineY[j]), spineY[j]);
      ctx.lineWidth = 2.1 * (0.86 + 0.14 * Math.sin(spineY[a] / 21));
      ctx.stroke();
    }
    if (tipY > spineY[last]) {
      ctx.beginPath();
      ctx.moveTo(spineX(spineY[last]), spineY[last]);
      ctx.lineTo(spineX(tipY), tipY);
      ctx.lineWidth = 2.1;
      ctx.stroke();
    }

    // 線画
    doodles.forEach((d) => {
      const t = clamp((tip - d.start) / d.span);
      if (t <= 0) return;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.scale(d.mirror ? -d.k : d.k, d.k);
      drawMotif(ctx, d.m, easeInOut(t), d.mirror, d.k);
      ctx.restore();
    });

    // お花
    flowers.forEach((f) => {
      const s = clamp((tip - f.y + 8) / 46);
      if (s > 0) drawFlower(ctx, f.x, f.y, easeOutBack(s), f.side);
    });

    // フェレット
    const fy = clamp(tipY, 0, H);
    ferret.style.transform = `translate3d(${spineX(fy).toFixed(1)}px, ${fy.toFixed(1)}px, 0)`;
    ferret.style.opacity = tip > 2 ? '1' : '0';
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    const d = target - shown;
    if (Math.abs(d) > 0.05) {
      shown = reduce ? target : shown + d * 0.16;
      dirty = true;
    } else if (shown !== target) {
      shown = target;
      dirty = true;
    }
    if (!dirty || !W) return;
    dirty = false;
    render();
  }
  raf = requestAnimationFrame(loop);

  return {
    layout,
    setAnchor(y) {
      target = reduce ? 1e6 : y;
    },
    destroy() {
      cancelAnimationFrame(raf);
    },
  };
}
