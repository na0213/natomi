/* SVGのパス文字列を、手描きっぽく揺らした点列に変換する（ブラウザ専用） */

export type Sampled = { pts: number[]; S: number[]; len: number };

const NS = 'http://www.w3.org/2000/svg';

export function createSampler(step = 2) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden';
  const meas = document.createElementNS(NS, 'path');
  svg.appendChild(meas);
  document.body.appendChild(svg);

  return {
    /** amp: 揺れの大きさ(px)。seed: 筆ごとにずらす */
    sample(d: string, seed = 0, amp = 0.5): Sampled {
      meas.setAttribute('d', d);
      const len = meas.getTotalLength();
      const n = Math.max(2, Math.ceil(len / step));
      const pts: number[] = [];
      const S: number[] = [];
      for (let i = 0; i <= n; i++) {
        const p = meas.getPointAtLength((len * i) / n);
        pts.push(p.x, p.y);
        S.push((len * i) / n);
      }
      for (let i = 0; i <= n; i++) {
        const a = Math.max(0, i - 1);
        const b = Math.min(n, i + 1);
        let tx = pts[2 * b] - pts[2 * a];
        let ty = pts[2 * b + 1] - pts[2 * a + 1];
        const l = Math.hypot(tx, ty) || 1;
        tx /= l;
        ty /= l;
        const s = S[i] + seed * 53;
        const off = amp * (0.62 * Math.sin(s / 19 + seed) + 0.38 * Math.sin(s / 6.1 + seed * 2));
        pts[2 * i] -= ty * off;
        pts[2 * i + 1] += tx * off;
      }
      return { pts, S, len };
    },
    dispose() {
      svg.remove();
    },
  };
}
