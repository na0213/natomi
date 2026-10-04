'use client';

import { useState, useEffect } from 'react';
import { Yomogi } from 'next/font/google';
import HeroScene from './HeroScene';

// 背景の線画（細いペン線）に合わせた手書き風の文字
const yomogi = Yomogi({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function TopSection() {
  const rightText = 'わくわくすること';
  const leftText = 'コツコツと';

  const rightLen = rightText.length;
  const leftLen = leftText.length;

  const [revealRightCount, setRevealRightCount] = useState(0);
  const [revealLeftCount, setRevealLeftCount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (revealRightCount < rightLen) {
      timer = setTimeout(() => setRevealRightCount((c) => c + 1), 150);
    } else if (revealLeftCount < leftLen) {
      timer = setTimeout(() => setRevealLeftCount((c) => c + 1), 150);
    } else if (!animationComplete) {
      setAnimationComplete(true);
    }
    return () => clearTimeout(timer);
  }, [revealRightCount, revealLeftCount, animationComplete, rightLen, leftLen]);

  const rows = Array.from({ length: rightLen });

  return (
    <section id="top" className="relative w-full">
      <div className="relative h-screen w-full bg-gradient-to-b from-[#eef9fa] to-[#fdfcf7] max-md:h-[78svh]">
        <HeroScene />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 md:px-16">
        <div className={`${yomogi.className} grid grid-cols-2 grid-rows-7 gap-x-2 gap-y-1 text-center text-base text-[#243033] [text-shadow:0_0_10px_#fff,0_0_3px_#fff] md:gap-x-4 md:gap-y-2 md:text-left md:text-4xl`}>
          {rows.map((_, i) => {
            const rightChar = i < revealRightCount ? rightText[i] : '';
            const leftChar = i > 0 && i - 1 < revealLeftCount ? leftText[i - 1] : '';
            return (
              <div key={i} className="contents">
                <div className="flex items-center justify-center md:justify-start">
                  {leftChar}
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  {rightChar}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {animationComplete && (
        <div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 transform">
          <div className="mx-auto h-9 w-1 animate-bounce bg-[#3be7ed]" />
        </div>
      )}
    </section>
  );
}
