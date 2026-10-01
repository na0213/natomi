/* トップの線画アニメーション：背景の線が引かれ、動物たちが落ちてきて弾み、床に並ぶ。
   タップ／クリックでぴょんと跳ね、目はポインターを追う。 */
import { ACTORS, COLORS, SPRITE_BOX, type ActorDef } from './heroActors';
import { buildWorld, WORLD_COLORS, type WorldItem } from './heroWorld';
import { createSampler, type Sampled } from './inkSample';
import { INK } from './inkMotifs';

type WItemS = { it: WorldItem; strokes: Sampled[]; total: number; fills: { p: Path2D; c: string }[] };
type ActorS = { def: ActorDef; strokes: Sampled[]; total: number; fills: { p: Path2D; c: string }[] };

type Body = {
  actor: ActorS | null;                    // null = ドット絵のフェレット
  sprite: HTMLCanvasElement | null;
  k: number;                               // 絵の拡大率（体の半径 / 42）
  r: number;
  padL: number; padR: number;               // 壁までの余白（絵のはみ出し分）
  x: number; y: number; vx: number; vy: number;
  ang: number; av: number;
  q: number; qv: number;                   // つぶれ(+)・のび(-)
  born: number;
  spawned: boolean;
  bornAt: number;                          // 実際に出た時刻
  landed: boolean;
  grounded: boolean;
  homeX: number;
  blinkAt: number; blinkUntil: number;
  spinning: boolean;
  hoverCool: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; kind: 0 | 1; col: string; ang: number };

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const TAU = Math.PI * 2;
const WORLD_END = 2.8;
const FAR_PAD = { x: 32, top: 110 };
const NEAR_PAD = { x: 24, top: 0 };

// 左から並ぶ順番（フェレットを真ん中あたりに）
const SLOT_ORDER = ['dolphin', 'tai', 'whale', 'ferret', 'penguin', 'sloth', 'cat', 'dog'];
// 落ちてくる順番（フェレットは最後）
const SPAWN_ORDER = ['dolphin', 'whale', 'tai', 'penguin', 'sloth', 'cat', 'dog', 'ferret'];

export type HeroEngine = { destroy: () => void };

export function createHero(opts: {
  wrap: HTMLElement;
  far: HTMLCanvasElement;
  near: HTMLCanvasElement;
  act: HTMLCanvasElement;
  reduce: boolean;
}): HeroEngine {
  const { wrap, far, near, act, reduce } = opts;
  const farCtx = far.getContext('2d')!;
  const nearCtx = near.getContext('2d')!;
  const ctx = act.getContext('2d')!;
  const sampler = createSampler(2);

  /* ---------- 絵のサンプリング（一度だけ） ---------- */
  const actorS = new Map<string, ActorS>();
  ACTORS.forEach((def, i) => {
    const strokes = def.strokes.map((d, si) => sampler.sample(d, i * 7 + si + 1, 0.4));
    actorS.set(def.id, {
      def,
      strokes,
      total: strokes.reduce((a, s) => a + s.len, 0),
      fills: def.fills.map((fl) => ({ p: new Path2D(fl.d), c: fl.c })),
    });
  });

  const ferretImg = new Image();
  let ferretReady = false;
  ferretImg.onload = () => {
    ferretReady = true;
    dirty = true;
    if (reduce && bodies.length) drawActors();
  };
  ferretImg.src = '/icons/up.png';

  /* ---------- 状態 ---------- */
  let W = 0;
  let H = 0;
  let dpr = 1;
  let groundY = 0;
  let floorY = 0;
  let gk = 1;
  let baseR = 40;
  let world: WItemS[] = [];
  let worldFinal = false;
  let bodies: Body[] = [];
  let particles: Particle[] = [];
  let dirty = true;
  let quiet = 0;
  let visible = true;
  let raf = 0;
  let last = 0;
  let t0 = 0;
  let T = 0;
  let nextIdle = 5;

  const pointer = { x: -1, y: -1, at: -99, hover: -1 };
  let parX = 0;
  let parXt = 0;
  let parY = 0;
  const fine = window.matchMedia('(pointer: fine)').matches;

  const rnd = (() => {
    let s = 12345;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  })();

  /* ---------- 描画：背景 ---------- */
  function sizeCanvas(c: HTMLCanvasElement, padX: number, padTop: number) {
    const w = W + padX * 2;
    const h = H + padTop;
    c.style.left = `${-padX}px`;
    c.style.top = `${-padTop}px`;
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
  }

  function drawWorldItem(g: CanvasRenderingContext2D, wi: WItemS, t: number) {
    if (t <= 0) return;
    const fa = smooth(0.62, 1, t);
    if (fa > 0) {
      g.save();
      g.translate(1.6, 1.6);
      g.globalAlpha = fa;
      for (const fl of wi.fills) {
        g.fillStyle = WORLD_COLORS[fl.c] ?? '#eee';
        g.fill(fl.p);
      }
      g.restore();
    }
    g.strokeStyle = INK;
    g.lineWidth = wi.it.lw ?? 2.1;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    let L = wi.total * clamp(t);
    for (const s of wi.strokes) {
      if (L <= 0) break;
      const lim = Math.min(s.len, L);
      const n = s.pts.length / 2;
      const ke = Math.min(n - 1, Math.ceil((lim / s.len) * (n - 1)));
      g.beginPath();
      g.moveTo(s.pts[0], s.pts[1]);
      for (let j = 1; j <= ke; j++) g.lineTo(s.pts[2 * j], s.pts[2 * j + 1]);
      g.stroke();
      L -= s.len;
    }
  }

  function renderWorld(tt: number) {
    for (const [g, pad, layer] of [
      [farCtx, FAR_PAD, 'far'],
      [nearCtx, NEAR_PAD, 'near'],
    ] as const) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W + pad.x * 2, H + pad.top);
      g.translate(pad.x, pad.top);
      for (const wi of world) {
        if (wi.it.layer !== layer) continue;
        drawWorldItem(g, wi, (tt - wi.it.delay) / wi.it.dur);
      }
    }
  }

  /* ---------- 動物の絵（スプライト化） ---------- */
  function drawActorArt(g: CanvasRenderingContext2D, a: ActorS, k: number, t: number) {
    const fa = smooth(0.55, 1, t);
    if (fa > 0) {
      g.save();
      g.translate(1.4, 1.4);
      g.globalAlpha = fa;
      for (const fl of a.fills) {
        g.fillStyle = COLORS[fl.c] ?? '#eee';
        g.fill(fl.p);
      }
      g.restore();
    }
    g.strokeStyle = INK;
    g.lineWidth = 2.2 / k;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    let L = a.total * clamp(t);
    for (const s of a.strokes) {
      if (L <= 0) break;
      const lim = Math.min(s.len, L);
      const n = s.pts.length / 2;
      const ke = Math.min(n - 1, Math.ceil((lim / s.len) * (n - 1)));
      g.beginPath();
      g.moveTo(s.pts[0], s.pts[1]);
      for (let j = 1; j <= ke; j++) g.lineTo(s.pts[2 * j], s.pts[2 * j + 1]);
      g.stroke();
      L -= s.len;
    }
    const ca = smooth(0.8, 1, t);
    if (ca > 0) {
      g.fillStyle = `rgba(240,160,152,${0.55 * ca})`;
      for (const c of a.def.cheeks) {
        g.beginPath();
        g.ellipse(c[0], c[1], 5.4, 3.6, 0, 0, TAU);
        g.fill();
      }
    }
  }

  function makeSprite(a: ActorS, k: number) {
    const c = document.createElement('canvas');
    c.width = Math.ceil(SPRITE_BOX.w * k * dpr);
    c.height = Math.ceil(SPRITE_BOX.h * k * dpr);
    const g = c.getContext('2d')!;
    g.setTransform(dpr * k, 0, 0, dpr * k, -SPRITE_BOX.x0 * k * dpr, -SPRITE_BOX.y0 * k * dpr);
    drawActorArt(g, a, k, 1);
    return c;
  }

  /* ---------- レイアウト ---------- */
  function layout() {
    const rect = wrap.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return;
    const oldW = W;
    const oldFloor = floorY;
    W = rect.width;
    H = rect.height;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    act.width = Math.round(W * dpr);
    act.height = Math.round(H * dpr);
    sizeCanvas(far, FAR_PAD.x, FAR_PAD.top);
    sizeCanvas(near, NEAR_PAD.x, NEAR_PAD.top);

    const built = buildWorld(W, H);
    groundY = built.groundY;
    floorY = groundY + 12 * built.scale;
    world = built.items.map((it, i) => {
      const strokes = it.strokes.map((d, si) => sampler.sample(d, i * 5 + si + 1, it.layer === 'far' ? 0.7 : 0.6));
      return {
        it,
        strokes,
        total: strokes.reduce((a, s) => a + s.len, 0),
        fills: it.fills.map((fl) => ({ p: new Path2D(fl.d), c: fl.c })),
      };
    });
    worldFinal = false;

    baseR = clamp(Math.min(W * 0.092, H * 0.108), 30, 64);
    gk = clamp(baseR / 46, 0.75, 1.25);

    if (!bodies.length) {
      bodies = SPAWN_ORDER.map((id, i) => {
        const isFerret = id === 'ferret';
        return {
          actor: isFerret ? null : actorS.get(id)!,
          sprite: null,
          k: 1,
          r: baseR,
          padL: baseR,
          padR: baseR,
          x: 0,
          y: -200,
          vx: 0,
          vy: 0,
          ang: 0,
          av: 0,
          q: 0,
          qv: 0,
          born: 0.95 + i * 0.48,
          spawned: false,
          bornAt: 0,
          landed: false,
          grounded: false,
          homeX: 0,
          blinkAt: 2 + rnd() * 3,
          blinkUntil: 0,
          spinning: false,
          hoverCool: 0,
        } as Body;
      });
    }

    const n = SLOT_ORDER.length;
    const margin = baseR * 1.7;
    bodies.forEach((b) => {
      const id = b.actor ? b.actor.def.id : 'ferret';
      b.r = b.actor ? baseR * b.actor.def.r : baseR * 0.84;
      b.k = b.r / 42;
      b.padL = b.actor ? b.actor.def.ext[0] * b.k : b.r * 1.05;
      b.padR = b.actor ? b.actor.def.ext[1] * b.k : b.r * 1.05;
      b.sprite = b.actor ? makeSprite(b.actor, b.k) : null;
      const slot = SLOT_ORDER.indexOf(id);
      b.homeX = margin + (slot * (W - margin * 2)) / (n - 1);
      if (oldW) {
        b.x = (b.x * W) / oldW;
        b.y += floorY - oldFloor;
      }
    });
    dirty = true;
    if (reduce) presimulate();
  }

  /* ---------- 物理 ---------- */
  function spawn(b: Body, i: number) {
    b.spawned = true;
    b.bornAt = T;
    const spacing = (W - baseR * 3.4) / (SLOT_ORDER.length - 1);
    b.x = clamp(b.homeX + (rnd() - 0.5) * spacing * 0.8, b.padL, W - b.padR);
    b.y = -b.r * 1.6;
    b.vx = (rnd() - 0.5) * 120;
    b.vy = 60;
    b.av = (rnd() - 0.5) * 3;
  }

  function sparks(x: number, y: number, n = 6) {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i - (n - 1) / 2) * 0.46;
      const sp = 150 + rnd() * 90;
      particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.45, max: 0.45, kind: 0, col: INK, ang: a });
    }
    const cols = [COLORS.pink, COLORS.blue, COLORS.yellow];
    for (let i = 0; i < 3; i++) {
      particles.push({ x: x + (i - 1) * 8, y, vx: (i - 1) * 50 + (rnd() - 0.5) * 30, vy: -120 - rnd() * 80, life: 0.7, max: 0.7, kind: 1, col: cols[i], ang: 0 });
    }
  }

  function dust(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      const dir = i < 2 ? -1 : 1;
      particles.push({ x, y, vx: dir * (60 + rnd() * 60), vy: -40 - rnd() * 40, life: 0.5, max: 0.5, kind: 1, col: '#e6efe0', ang: 0 });
    }
  }

  function hop(b: Body, dir: number, power = 1) {
    if (!b.spawned) return;
    b.vy = -(790 + rnd() * 90) * gk * power;
    b.vx += dir * 230 * gk * power;
    b.q = -0.22;
    b.qv = 0;
    b.grounded = false;
    if (!b.actor) {
      b.spinning = true;
      b.av = 15 * (dir || 1);
    }
    sparks(b.x, b.y - b.r, power > 0.8 ? 6 : 4);
    dirty = true;
  }

  function step(dt: number) {
    const G = 2300 * gk;
    const settleSpring = T > 5.4;
    for (const b of bodies) {
      if (!b.spawned) continue;
      if (b.grounded && settleSpring) b.vx += (b.homeX - b.x) * 1.5 * dt;
      b.vy += G * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.vx *= 1 - 0.12 * dt;

      if (b.spinning) {
        b.ang += b.av * dt;
        if (Math.abs(b.ang) > TAU) {
          b.ang = 0;
          b.av = 0;
          b.spinning = false;
        }
      } else {
        b.ang += b.av * dt;
        b.av += (-95 * b.ang - 9 * b.av) * dt;
        b.ang = clamp(b.ang, -0.9, 0.9);
      }

      // つぶれ・のびのバネ
      b.qv += (-300 * b.q - 14 * b.qv) * dt;
      b.q += b.qv * dt;

      if (b.x < b.padL) {
        b.x = b.padL;
        b.vx = Math.abs(b.vx) * 0.4;
      } else if (b.x > W - b.padR) {
        b.x = W - b.padR;
        b.vx = -Math.abs(b.vx) * 0.4;
      }

      b.grounded = false;
      if (b.y + b.r > floorY) {
        b.y = floorY - b.r;
        const vn = b.vy;
        if (vn > 120) {
          b.q = Math.max(b.q, Math.min(0.4, vn / 1500));
          b.qv = 0;
          if (!b.landed) {
            b.landed = true;
            dust(b.x, floorY);
          }
        }
        b.vy = vn > 180 ? -vn * 0.34 : 0;
        b.vx *= 1 - 5 * dt;
        b.av += (b.vx / b.r) * 0.2 * dt;
        b.grounded = true;
      }
    }

    // 体どうしの衝突
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      if (!a.spawned) continue;
      for (let j = i + 1; j < bodies.length; j++) {
        const c = bodies[j];
        if (!c.spawned) continue;
        const dx = c.x - a.x;
        const dy = c.y - a.y;
        const d = Math.hypot(dx, dy);
        const min = (a.r + c.r) * 0.96;
        if (d >= min || d === 0) continue;
        const nx = dx / d;
        const ny = dy / d;
        const ov = min - d;
        const ma = a.r * a.r;
        const mc = c.r * c.r;
        const tot = ma + mc;
        a.x -= nx * ov * (mc / tot);
        a.y -= ny * ov * (mc / tot);
        c.x += nx * ov * (ma / tot);
        c.y += ny * ov * (ma / tot);
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (rv < 0) {
          const jn = (-(1 + 0.28) * rv) / (1 / ma + 1 / mc);
          a.vx -= (jn * nx) / ma;
          a.vy -= (jn * ny) / ma;
          c.vx += (jn * nx) / mc;
          c.vy += (jn * ny) / mc;
          if (-rv > 180) {
            a.q = Math.max(a.q, 0.12);
            c.q = Math.max(c.q, 0.12);
            a.av += (rnd() - 0.5) * 2.2;
            c.av += (rnd() - 0.5) * 2.2;
          }
        }
      }
      // 上に乗っているときは床とみなして接地扱い
    }
    // 他の体の上でも「接地」とみなす（並ぶ力を効かせる）
    for (const a of bodies) {
      if (!a.spawned || a.grounded) continue;
      for (const c of bodies) {
        if (c === a || !c.spawned) continue;
        const dy = a.y - c.y;
        if (dy < 0 && Math.hypot(a.x - c.x, dy) < (a.r + c.r) * 1.02 && Math.abs(a.vy) < 60) a.grounded = true;
      }
    }

    // 粒
    for (const p of particles) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.kind === 1 ? 260 : 0) * dt;
      p.vx *= 1 - 3 * dt;
    }
    particles = particles.filter((p) => p.life > 0);
  }

  function presimulate() {
    T = 99;
    const t = 1 / 60;
    bodies.forEach((b, i) => {
      b.spawned = true;
      b.x = b.homeX;
      b.y = -b.r * (1 + i * 1.6);
      b.vx = 0;
      b.vy = 0;
      b.landed = true;
    });
    for (let i = 0; i < 360; i++) step(t);
    bodies.forEach((b) => {
      b.q = 0;
      b.qv = 0;
      b.ang = 0;
      b.av = 0;
      b.bornAt = -99;
    });
    particles = [];
    renderWorld(99);
    worldFinal = true;
    dirty = true;
    drawActors();
  }

  /* ---------- 描画：動物 ---------- */
  function drawActors() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // 影
    for (const b of bodies) {
      if (!b.spawned) continue;
      const h = clamp((floorY - (b.y + b.r)) / 220);
      const rx = b.r * (0.95 - 0.35 * h);
      ctx.fillStyle = `rgba(104,80,64,${0.16 * (1 - h)})`;
      ctx.beginPath();
      ctx.ellipse(b.x, floorY + 1, rx, rx * 0.2, 0, 0, TAU);
      ctx.fill();
    }

    const lookOn = T - pointer.at < 4;
    for (const b of bodies) {
      if (!b.spawned) continue;
      const reveal = reduce ? 1 : clamp((T - b.bornAt) / 0.7);
      const vstretch = clamp(Math.abs(b.vy) / 5200, 0, 0.1);
      const sx = 1 + 0.55 * b.q - vstretch * 0.5;
      const sy = 1 - b.q + vstretch;

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.ang);
      ctx.translate(0, b.r);
      ctx.scale(sx, sy);
      ctx.translate(0, -b.r);

      if (b.actor) {
        const a = b.actor;
        if (reveal < 1) {
          ctx.save();
          ctx.scale(b.k, b.k);
          drawActorArt(ctx, a, b.k, reveal);
          ctx.restore();
        } else if (b.sprite) {
          ctx.drawImage(b.sprite, SPRITE_BOX.x0 * b.k, SPRITE_BOX.y0 * b.k, SPRITE_BOX.w * b.k, SPRITE_BOX.h * b.k);
        }
        // 目（ポインターを追う・まばたき）
        if (reveal > 0.9) {
          let ox = 0;
          let oy = 0;
          if (lookOn) {
            const dx = pointer.x - b.x;
            const dy = pointer.y - b.y;
            const dist = Math.hypot(dx, dy) || 1;
            const m = clamp(dist / 160) * 2.4;
            const ux = dx / dist;
            const uy = dy / dist;
            ox = (ux * Math.cos(-b.ang) - uy * Math.sin(-b.ang)) * m;
            oy = (ux * Math.sin(-b.ang) + uy * Math.cos(-b.ang)) * m;
          }
          const blink = T < b.blinkUntil;
          ctx.save();
          ctx.scale(b.k, b.k);
          for (const e of a.def.eyes) {
            ctx.fillStyle = '#4a3a30';
            ctx.beginPath();
            ctx.ellipse(e[0] + ox, e[1] + oy, 3.3, blink ? 0.6 : 3.7, 0, 0, TAU);
            ctx.fill();
            if (!blink) {
              ctx.fillStyle = '#fff';
              ctx.beginPath();
              ctx.arc(e[0] + ox + 1, e[1] + oy - 1.2, 1.1, 0, TAU);
              ctx.fill();
            }
          }
          ctx.restore();
        }
      } else if (ferretReady) {
        const s = b.r * 2.9;
        ctx.globalAlpha = smooth(0, 0.35, reveal);
        ctx.drawImage(ferretImg, -s / 2, -s / 2 - b.r * 0.08, s, s);
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    }

    // 粒
    for (const p of particles) {
      const a = clamp(p.life / p.max);
      ctx.globalAlpha = a;
      if (p.kind === 0) {
        const len = 9 * a + 3;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.cos(p.ang) * len, p.y + Math.sin(p.ang) * len);
        ctx.stroke();
      } else {
        ctx.fillStyle = p.col;
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.4, 0, TAU);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- ループ ---------- */
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!visible) {
      last = now;
      return;
    }
    if (!t0) t0 = now;
    T = (now - t0) / 1000;
    const dt = Math.min(0.033, (now - (last || now)) / 1000);
    last = now;

    if (T < WORLD_END) renderWorld(T);
    else if (!worldFinal) {
      renderWorld(99);
      worldFinal = true;
    }

    let spawnedNow = false;
    bodies.forEach((b, i) => {
      if (!b.spawned && T >= b.born) {
        spawn(b, i);
        spawnedNow = true;
      }
    });

    step(dt / 2);
    step(dt / 2);

    // 目のまばたきと、ときどき自分で跳ねる
    for (const b of bodies) {
      if (b.spawned && T > b.blinkAt) {
        b.blinkUntil = T + 0.13;
        b.blinkAt = T + 2 + rnd() * 3.5;
        dirty = true;
      }
      if (b.blinkUntil && T < b.blinkUntil + 0.02) dirty = true;
    }
    if (T > nextIdle && T > 6) {
      const c = bodies.filter((b) => b.spawned && b.grounded);
      if (c.length) hop(c[Math.floor(rnd() * c.length)], rnd() - 0.5, 0.55);
      nextIdle = T + 3.2 + rnd() * 3;
    }

    // パララックス
    if (fine) parX += (parXt - parX) * 0.06;
    far.style.transform = `translate3d(${(parX * 7).toFixed(2)}px, ${(parY * 0.14).toFixed(2)}px, 0)`;
    near.style.transform = `translate3d(${(parX * -5).toFixed(2)}px, 0, 0)`;

    let moving = spawnedNow || particles.length > 0 || T < WORLD_END + 0.5 || T - pointer.at < 0.3;
    let speed = 0;
    for (const b of bodies) {
      if (!b.spawned) {
        moving = true;
        continue;
      }
      speed = Math.max(speed, Math.hypot(b.vx, b.vy) + Math.abs(b.av) * 8);
      if (Math.abs(b.q) > 0.008 || Math.abs(b.qv) > 0.1 || T - b.bornAt < 0.8) moving = true;
    }
    if (speed > 6) moving = true;
    if (moving || dirty) {
      quiet = 0;
      dirty = false;
    } else quiet++;
    if (quiet < 3) drawActors();
  }

  /* ---------- 操作 ---------- */
  function hit(x: number, y: number) {
    let found: Body | null = null;
    for (const b of bodies) {
      if (!b.spawned) continue;
      if (Math.hypot(x - b.x, y - b.y) < b.r * 1.12) found = b;
    }
    return found;
  }

  function local(e: PointerEvent) {
    const r = wrap.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width };
  }

  function onMove(e: PointerEvent) {
    const p = local(e);
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.at = T;
    if (e.pointerType === 'mouse') {
      parXt = (p.x / p.w - 0.5) * 2;
      const b = hit(p.x, p.y);
      wrap.style.cursor = b ? 'pointer' : 'default';
      const idx = b ? bodies.indexOf(b) : -1;
      if (idx !== pointer.hover) {
        pointer.hover = idx;
        if (b && T - b.hoverCool > 0.6) {
          b.hoverCool = T;
          b.q = Math.max(b.q, 0.14);
          b.qv = 0;
        }
      }
    }
    dirty = true;
  }

  let down: { x: number; y: number; t: number } | null = null;
  function onDown(e: PointerEvent) {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
  }
  function onUp(e: PointerEvent) {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const dur = performance.now() - down.t;
    down = null;
    if (moved > 12 || dur > 450 || reduce) return;
    const p = local(e);
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.at = T;
    const b = hit(p.x, p.y);
    if (b) hop(b, (b.x - p.x) / b.r, 1);
    else {
      for (const o of bodies) {
        if (!o.spawned) continue;
        const d = Math.hypot(o.x - p.x, o.y - p.y);
        if (d < 190 * gk + o.r) hop(o, Math.sign(o.x - p.x) || 1, 0.55);
      }
    }
  }
  function onLeave() {
    pointer.hover = -1;
    wrap.style.cursor = 'default';
    parXt = 0;
  }
  function onScroll() {
    parY = clamp(window.scrollY, 0, 1200);
  }

  wrap.addEventListener('pointermove', onMove, { passive: true });
  wrap.addEventListener('pointerdown', onDown, { passive: true });
  wrap.addEventListener('pointerup', onUp, { passive: true });
  wrap.addEventListener('pointerleave', onLeave, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  const ro = new ResizeObserver(layout);
  ro.observe(wrap);
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible) dirty = true;
  });
  io.observe(wrap);

  layout();
  if (!reduce) raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerdown', onDown);
      wrap.removeEventListener('pointerup', onUp);
      wrap.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      sampler.dispose();
    },
  };
}
