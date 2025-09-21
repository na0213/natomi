'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        className="fixed bottom-6 right-6 z-50 p-0 bg-transparent border-none shadow-none"
        aria-label="Scroll to top"
      >
        <Image
          src="/icons/up.png"
          alt="上へ"
          width={48}
          height={48}
          className="animate-slow-bounce transform transition-transform duration-500 ease-in-out hover:scale-125"
        />
      </button>
    )
  );
}
