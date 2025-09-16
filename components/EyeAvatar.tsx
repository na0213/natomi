'use client';

import { useEffect, useRef } from 'react';

type Props = {
  size?: number;        // 目の全体サイズ（白目を含む）
  pupilRatio?: number;  // 黒目の大きさ（白目に対する比率）
  className?: string;   // 追加クラス
};

export default function EyeAvatar({ size = 20, pupilRatio = 0.55, className = '' }: Props) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const pupilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eye = eyeRef.current;
    const pupil = pupilRef.current;
    if (!eye || !pupil) return;

    const onMove = (e: MouseEvent) => {
      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      // 黒目が動ける範囲
      const pupilRadius = (size * pupilRatio) / 2;
      const padding = 2;
      const max = rect.width / 2 - pupilRadius - padding;

      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;

      const tx = ux * Math.min(max, len);
      const ty = uy * Math.min(max, len);

      pupil.style.transform = `translate(${tx}px, ${ty}px)`;
    };

    const onLeave = () => {
      if (pupil) pupil.style.transform = `translate(0, 0)`;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, [size, pupilRatio]);

  const pupilSize = size * pupilRatio;

  return (
    <div
      ref={eyeRef}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '9999px',
        border: '1.5px solid #333',
        background: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
      aria-hidden
    >
      <div
        ref={pupilRef}
        style={{
          width: pupilSize,
          height: pupilSize,
          background: '#111',
          borderRadius: '9999px',
          position: 'absolute',
          transform: 'translate(0, 0)',
          transition: 'transform 90ms linear',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
