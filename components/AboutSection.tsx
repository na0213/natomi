
'use client';

import { useEffect, useState } from 'react';

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

    useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (!aboutSection) return;

      const sectionTop = aboutSection.offsetTop;
      const sectionHeight = aboutSection.offsetHeight;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // セクションが表示範囲に入ったときの計算
      const sectionStart = sectionTop - windowHeight;
      const sectionEnd = sectionTop + sectionHeight;

      if (scrollPosition >= sectionStart && scrollPosition <= sectionEnd) {
        // セクション内でのスクロール進行率を計算
        const progress = Math.min(Math.max((scrollPosition - sectionStart) / (sectionEnd - sectionStart), 0), 1);
        setLineHeight(progress * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期値を設定

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const timelineItems = [
    {
      side: 'left',
      period: '2022年〜現在',
      title: '職歴',
      role: 'ラグビー協会 事務',
      description: 'ラグビー協会での事務業務全般を担当'
    },
    {
      side: 'right',
      period: '2021年',
      title: '職歴',
      role: 'フリーランス ライター',
      description: 'Webメディアでの記事執筆、コンテンツ制作'
    },
    {
      side: 'left',
      period: '2015年〜2017年',
      title: '学歴',
      school: '○○大学 大学院（生物学専攻）',
      description: '分子生物学分野での研究活動'
    },
    {
      side: 'right',
      period: '2011年〜2015年',
      title: '学歴',
      school: '○○大学 生物学部',
      description: '生物学部での基礎学習'
    }
  ];

  return (
    <section id="about" className="py-20 bg-[#F9F9F9] mt-16">
      <div className="container mx-auto px-4">
        <div className={`fade-in ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl font-bold text-center mb-16 text-[#333]">About</h2>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* 背景の線（グレー） */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-300 hidden md:block"></div>

              {/* アニメーションの線（青） */}              
              <div 
                className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-[#3be7ed] hidden md:block transition-all duration-300 ease-out"
                style={{ height: `${lineHeight}%` }}
              ></div>
              
              <div className="space-y-8">
                {timelineItems.map((item, index) => (
                  <div key={index} className={`timeline-item relative ${
                    item.side === 'left' ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left md:ml-auto'
                  } md:w-1/2`}>
                    <div className={`bg-white p-6 rounded-lg shadow-sm ${
                      item.side === 'left' ? 'md:mr-8' : 'md:ml-8'
                    }`}>
                      <div className={`absolute top-8 w-3 h-3 bg-[#3be7ed] rounded-full transform ${
                        item.side === 'left' 
                          ? 'right-0 translate-x-1/2' 
                          : 'left-0 -translate-x-1/2'
                      } hidden md:block`}></div>
                      
                      <div className="text-sm text-[#3be7ed] font-medium mb-2">{item.period}</div>
                      <div className="text-xs text-gray-500 mb-1">{item.title}</div>
                      <h4 className="text-lg font-semibold text-[#333] mb-2">
                        {item.role || item.school}
                      </h4>
                      <p className="text-gray-700 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}