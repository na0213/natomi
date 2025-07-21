
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
      period: '2025年〜',
      role: 'ライター',
      description: 'Webメディア、広報ライター'
    },
    {
      side: 'left',
      period: '〜2025年',
      role: 'コミュニティマネージャー',
      description: '地域バイヤープログラムのコミュマネとして受講生とのコミュニケーションを担当'
    },
    {
      side: 'right',
      period: '2024年',
      role: 'インタビューライター養成講座',
      description: '株式会社WHEREの講座。地域密着の取材執筆を行う'
    },
    {
      side: 'right',
      period: '2024年',
      school: '地域バイヤープログラム',
      description: '株式会社WHEREの講座。地域の生産者を訪問し、仕入れ、AKOMEYA TOKYOにてPOPUP販売'
    },
    {
      side: 'right',
      period: '2023年〜2024年',
      school: 'G\'s Devコース',
      description: 'HTML/CSS/PHP/Laravelのほか、Next.js/Reactを学ぶ。'
    },
    {
      side: 'right',
      period: '2022年〜2022年',
      school: 'SAMURAI ENGINEER エキスパートコース',
      description: 'HTML/CSS/PHP/Laravelを学ぶ。'
    },
    {
      side: 'left',
      period: '2017年〜2024年',
      school: '化粧品・健康食品メーカー',
      description: '物流・品質管理業務。製品の品質向上に貢献'
    },
    {
      side: 'right',
      period: '〜2008年',
      school: '生物資源科学修士',
      description: '遺伝学。鯨類胎盤の女性ホルモンについて解析。'
    }
  ];

  return (
    <section id="about" className="py-20 bg-[#F9F9F9] mt-16">
      <div className="container mx-auto px-4">
        <div className={`fade-in ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl font-bold text-center mb-16 text-[#333]">About</h2>

          {/* プロフィールセクション */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  <Image src="/natomi.png" alt="プロフィール写真" width={128} height={128} className="rounded-full object-cover object-top border-4 border-[#3be7ed]"/>
                  <img 
                    src="/natomi.png"
                    alt="プロフィール写真"
                    className="w-32 h-32 rounded-full object-cover object-top border-4 border-[#3be7ed]"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-[#333] mb-4">N a t o m i</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      大学では生物学を専攻し、大学病院での研究補助、化粧品・健康食品メーカーでの物流・品質管理業務に従事してきました。
                      プログラミングを学び、個人開発を楽しむ傍ら、フリーランスライターとして取り組んでいます。
                    </p>
                    <p>
                      新しい技術を学ぶことが好きで、ユーザーにとって使いやすく、
                      価値のあるWebサービスを作ることを目指しています。
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-[#3be7ed] text-white text-sm rounded-full">ライティング</span>
                      <span className="px-3 py-1 bg-[#3be7ed] text-white text-sm rounded-full">開発</span>
                      <span className="px-3 py-1 bg-[#3be7ed] text-white text-sm rounded-full">生成AI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 職歴・学歴タイムライン */}
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="hidden md:flex w-full mb-8">
                <div className="w-1/2 flex justify-center">
                  <h3 className="text-xl font-bold text-[#333]">Work Experience</h3>
                </div>
                <div className="w-1/2 flex justify-center">
                  <h3 className="text-xl font-bold text-[#333]">Education</h3>
                </div>
              </div>
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