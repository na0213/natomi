'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
      <div className="relative h-screen w-full max-md:h-[60vh]">
        <Image src="/background4.png" alt="背景" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 md:px-16">
        <div className="grid grid-cols-2 grid-rows-7 gap-x-2 gap-y-1 text-center text-base text-white md:gap-x-4 md:gap-y-2 md:text-left md:text-4xl">
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
        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform">
          <div className="mx-auto h-12 w-1 animate-bounce bg-[#3be7ed]" />
        </div>
      )}
    </section>
  );
}
