'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TopSection() {
  const rightText = '小さくはじめて';
  const leftText = '夢はでっかく';

  const rightLen = rightText.length;
  const leftLen = leftText.length;

  const [revealRightCount, setRevealRightCount] = useState(0);
  const [revealLeftCount, setRevealLeftCount] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (revealRightCount < rightLen) {
      timer = setTimeout(() => setRevealRightCount(c => c + 1), 150);
    } else if (revealLeftCount < leftLen) {
      timer = setTimeout(() => setRevealLeftCount(c => c + 1), 150);
    } else if (!animationComplete) {
      setAnimationComplete(true);
    }
    return () => clearTimeout(timer);
  }, [revealRightCount, revealLeftCount, animationComplete]);

  const rows = Array.from({ length: rightLen });

  return (
    <section className="relative w-full">
      {/* 背景画像（スマホのみ高さを小さく） */}
      <div className="relative w-full h-screen max-md:h-[60vh]">
        <Image src="/background4.png" alt="背景" layout="fill" objectFit="cover" priority/>
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* テキスト（画像上に重ねる） */}
<div className="absolute inset-0 z-10 flex items-center justify-center px-4 md:px-16">
  <div className="grid grid-rows-7 grid-cols-2 gap-y-1 md:gap-y-2 gap-x-2 md:gap-x-4 text-base md:text-4xl text-white text-center md:text-left md:-ml-[400px]">
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

      {/* 下の矢印 */}
      {animationComplete && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-1 h-12 bg-[#3be7ed] mx-auto animate-bounce" />
        </div>
      )}
    </section>
  );
}
