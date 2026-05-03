'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Darumadrop_One } from 'next/font/google';

const darumadrop = Darumadrop_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className="group fixed bottom-6 right-6 z-50 p-0 bg-transparent border-none shadow-none"
        aria-label="Scroll to top"
      >
        <span className={`${darumadrop.className} absolute -top-11 right-0 -rotate-6 whitespace-nowrap rounded-[48%_52%_46%_54%/58%_45%_55%_42%] border-2 border-[#8edfe2] bg-white px-4 py-1 text-base text-[#087f86] shadow-sm`}>
          上へ
          <span className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 border-b-2 border-r-2 border-[#8edfe2] bg-white" />
        </span>
        <Image
          src="/icons/up.png"
          alt="上へ"
          width={58}
          height={58}
          className="animate-slow-bounce transform transition-transform duration-500 ease-in-out hover:scale-125"
        />
      </button>
    )
  );
}
