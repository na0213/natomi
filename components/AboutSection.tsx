'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Briefcase, GraduationCap, Plus, X } from 'lucide-react';
import styles from './AboutSection.module.css';
import EyeAvatar from '@/components/EyeAvatar';
import { Darumadrop_One } from 'next/font/google';
import AboutTimeline, { TimelineItem } from './AboutTimeline';

const darumadrop = Darumadrop_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

/* =========================
   型定義
   ========================= */
type Side = 'left' | 'right';

type RawItem = {
  side: 'left' | 'right';
  period: string;              // 表示用
  when?: string;               // 単一の年月 (YYYY/MM)
  range?: [string, string];    // 開始〜終了の年月
  role?: string;               // 表示名が role の場合
  school?: string;             // 表示名が school の場合
  description: string;
};

/* =========================
   データ
   ========================= */
const TIMELINE_ITEMS: RawItem[] = [
  { side: 'left',  period: '2025年〜', when: '2025/05', role: '事務', description: 'スポーツ協会の事務' },
  { side: 'left',  period: '2024年〜', when: '2024/10', role: 'ライター', description: 'Webメディア・広報の取材執筆' },
  { side: 'right', period: '〜2025年', when: '2025/02', role: 'コミュニティマネージャー', description: '株式会社WHEREの地域バイヤープログラムにて、受講生とのコミュニケーション運営を担当' },
  { side: 'right', period: '2024年', when: '2024/10', role: 'インタビューライター養成講座修了', description: 'LOCAL LETTERにて、地域密着の取材・執筆を実践' },
  { side: 'right', period: '2024年', when: '2024/06', role: '地域バイヤープログラム修了', description: '株式会社WHEREにて、生産者訪問〜仕入れ〜AKOMEYA TOKYOでのPOPUP販売までを実践' },
  { side: 'right', period: '2023年〜2024年', range: ['2023/04', '2024/03'], role: "G'sアカデミー Devコース", description: 'HTML/CSS/PHP/Laravel、Next.js/React などを学習' },
  { side: 'right', period: '2022年', range: ['2022/04', '2022/12'], role: 'SAMURAI ENGINEER エキスパートコース', description: 'HTML/CSS/PHP/Laravel を学習' },
  { side: 'left',  period: '2017年〜2024年', range: ['2017/04', '2024/03'], role: '物流・品質管理', description: '化粧品・健康食品メーカーにて品質管理、物流改善に従事' },
  { side: 'right', period: '〜2008年', when: '2008/03', role: '生物資源科学 修士', description: '遺伝学（鯨類胎盤の女性ホルモン解析）' },
  { side: 'left',  period: '2015年〜2017年', range: ['2015/04', '2017/03'], role: '研究補助・秘書', description: '大学病院での研究補助・秘書業務' },
];

/* =========================
   ユーティリティ
   ========================= */
const parsePeriodYearRange = (period: string) => {
  const years = (period.match(/\d{4}(?=年)/g) || []).map(Number);
  const hasLeading = /^〜/.test(period);
  const hasTrailing = /〜$/.test(period);
  const currentYear = new Date().getFullYear();

  if (years.length === 2) {
    const [a, b] = years;
    return { startY: Math.min(a, b), endY: Math.max(a, b) };
  }
  if (years.length === 1) {
    const y = years[0];
    if (hasTrailing) return { startY: y, endY: Math.max(y, currentYear) };
    if (hasLeading)  return { startY: y - 1, endY: y };
    return { startY: y, endY: y };
  }
  return { startY: currentYear, endY: currentYear };
};

function toTimelineItems(raw: RawItem[]): TimelineItem[] {
  return raw.map(it => {
    let range: string;
    if (it.when) {
      range = it.when; // "2024/10"
    } else if (it.range) {
      range = it.range[1];
    } else {
      throw new Error('when または range が必要です');
    }

    return {
      side: it.side,
      period: it.period,
      range,
      title: it.role || it.school || '(未設定)',
      description: it.description,
    };
  });
}

/* =========================
   コンポーネント本体
   ========================= */
export default function AboutSection() {
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const timelineItems = useMemo(() => toTimelineItems(TIMELINE_ITEMS), []);
  const cards = [
    { title: 'Animal',  modal: 'フェレットと暮らしています。イヌ、ネコ、イルカ、ペンギン、ナマケモノなどなど、動物はだいたい好きです。', img: '/about/ferret.png' },
    { title: 'Running', modal: '時間があると川沿いを走ります。トレイルランニングで色々な山も走っています。', img: '/about/run.png' },
    { title: 'Travel',  modal: '地域の魅力を知る旅がすき。温泉やオーベルジュにこだわりのある宿探しをしています。', img: '/about/trip.png' },
    { title: 'Fishing', modal: '主に海釣り。アジからタイや本ガツオまで。魚は自ら捌いていただいています。', img: '/about/fish.png' },
  ];
  const closeBgByIndex = ['/icons/pink.png', '/icons/blue.png', '/icons/green.png', '/icons/yellow.png'];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenCard(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const ob = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    const el = document.getElementById('about');
    if (el) ob.observe(el);
    return () => ob.disconnect();
  }, []);

  /* ========= JSX ========= */
  return (
    <section id="about" className="py-20 bg-[#F9F9F9] mt-16 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className={`fade-in ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl text-center mb-16 text-[#333] flex items-center justify-center gap-2">
            わ た し の こ と
            <span className="flex items-center gap-1">
              <EyeAvatar size={16} pupilRatio={0.65} />
              <EyeAvatar size={16} pupilRatio={0.65} />
            </span>
          </h2>

          {/* プロフィール */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  <Image src="/natomi.png" alt="プロフィール写真" width={128} height={128}
                    className="rounded-full object-cover object-top border-2 border-[#09dbd0]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-[#333] mb-4">N a t o m i</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      小さい頃から動物が大好き。大学では海洋学を専攻し、クジラや{' '}
                      <span className="relative inline-block group align-baseline">
                        <span className={`${darumadrop.className} text-[#06becf] align-baseline text-[1.15em] md:text-[1.2em] transition-all duration-300 group-hover:text-[1.3em] md:group-hover:text-[1.4em]`}>
                          イルカ
                        </span>
                        <span aria-hidden
                          className="pointer-events-none absolute -top-8 -right-8 opacity-0 scale-75 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                          <Image src="/icons/dolphin.png" alt="イルカアイコン" width={35} height={35} className="drop-shadow-md" />
                        </span>
                      </span>
                      の研究（遺伝学）をしていました。
                    </p>

                    <p>
                      仕事は事務や大学病院での研究補助、化粧品・健康食品メーカーで物流管理や品質管理の仕事を経験。<br />
                      現在は{' '}
                      <span className="relative inline-block group align-baseline">
                        <span className={`${darumadrop.className} text-[#06becf] align-baseline text-[1.15em] md:text-[1.2em] transition-all duration-300 group-hover:text-[1.3em] md:group-hover:text-[1.4em]`}>
                          ライター
                        </span>
                        <span aria-hidden
                          className="pointer-events-none absolute -top-8 -right-8 opacity-0 scale-75 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                          <Image src="/icons/pen.png" alt="ペンアイコン" width={35} height={35} className="drop-shadow-md" />
                        </span>
                      </span>
                      としても活動しています。
                    </p>

                    <p>
                      2022年よりプログラミングに興味をもち、個人開発を楽しむ日々。<br />
                      新しい技術を試すのが好きで、”使いやすくてちょっと{' '}
                      <span className="relative inline-block group align-baseline">
                        <span className={`${darumadrop.className} text-[#06becf] align-baseline text-[1.15em] md:text-[1.2em] transition-all duration-300 group-hover:text-[1.3em] md:group-hover:text-[1.4em]`}>
                          心が動く
                        </span>
                        <span aria-hidden
                          className="pointer-events-none absolute -top-8 -right-8 opacity-0 scale-75 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100">
                          <Image src="/icons/heart.png" alt="♡アイコン" width={35} height={35} className="drop-shadow-md" />
                        </span>
                      </span>
                      ”ようなWebサービスをつくることを目指しています。
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                      <span className="px-3 py-1 text-[#09dbd0] font-bold text-sm"># ライティング</span>
                      <span className="px-3 py-1 text-[#09dbd0] font-bold text-sm"># 開発</span>
                      <span className="px-3 py-1 text-[#09dbd0] font-bold text-sm"># 生成AI</span>
                      <span className="px-3 py-1 text-[#09dbd0] font-bold text-sm"># WebAR</span>
                      <span className="px-3 py-1 text-[#09dbd0] font-bold text-sm"># 食品衛生責任者</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4枚のカード（右に＋ボタン：ホバーで花背景＋回転拡大） */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {cards.map((c, i) => (
                <article key={i} className="group relative bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6 h-full transition-shadow hover:shadow-md focus-within:shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-semibold text-[#333]">{c.title}</h4>

                    <button
                      type="button"
                      aria-label={`${c.title} の詳細を開く`}
                      onClick={() => setOpenCard(i)}
                      className="group/close relative inline-flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#09dbd0]/30"
                    >
                      <span
                        aria-hidden
                        className="absolute -inset-5 rounded-full opacity-0 scale-75 transition-all duration-300 ease-out group-hover/close:opacity-100 group-hover/close:scale-125"
                        style={{
                          backgroundImage: `url(${closeBgByIndex[i % closeBgByIndex.length]})`,
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                      <Plus
                        className="relative z-10 text-[#696969] w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 ease-out group-hover/close:rotate-45 group-hover/close:scale-125"
                        strokeWidth={5}
                      />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* 拡大カード（オーバーレイ） */}
          {openCard !== null && (
            <div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-4"
              onClick={(e) => { if (e.target === e.currentTarget) setOpenCard(null); }}
              aria-modal="true"
              role="dialog"
            >
              <div
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-4 sm:p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="閉じる"
                  onClick={() => setOpenCard(null)}
                  className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#09dbd0]/30"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="absolute -top-8 -left-4">
                  <div className={`relative w-24 h-24 sm:w-24 sm:h-24 rounded-xl overflow-hidden ${styles.popIn}`}>
                    <Image
                      src={cards[openCard].img}
                      alt={`${cards[openCard].title} のイメージ`}
                      fill
                      sizes="112px"
                      className={`object-cover ${styles.sway}`}
                      priority
                    />
                  </div>
                </div>

                <div className="mt-12 sm:mt-16 ml-16 sm:ml-20">
                  <p className="text-gray-700 leading-relaxed">{cards[openCard].modal}</p>
                </div>
              </div>
            </div>
          )}

          {/* スマホ：1カラム（しごと → かつどう） */}
          <div className="max-w-6xl mx-auto md:hidden">
            {/* しごと */}
          <h3 className="flex items-center justify-start text-base font-bold text-gray-700 mb-3">
            <img src="/icons/pink.png" alt="" aria-hidden="true" className="inline-block w-5 h-5 mr-2" />
            しごと
          </h3>
            <div className="space-y-5">
              {timelineItems.filter(i => i.side === 'left').map((it) => (
                <div key={`${it.period}-${it.title}`}>
                  <div className="text-xs text-[#808080] mb-1">{it.period}</div>
                  <div className="text-[15px] font-semibold text-[#374151]">{it.title}</div>
                  <p className="text-sm text-gray-700 mt-1">{it.description}</p>
                </div>
              ))}
            </div>

            {/* かつどう */}
            <h3 className="flex items-center justify-start text-base font-bold text-gray-700 mt-8 mb-3">
              <img src="/icons/green.png" alt="" aria-hidden="true" className="inline-block w-5 h-5 mr-2" />
              かつどう
            </h3>

            <div className="space-y-5">
              {timelineItems.filter(i => i.side === 'right').map((it) => (
                <div key={`${it.period}-${it.title}`}>
                  <div className="text-xs text-[#808080] mb-1">{it.period}</div>
                  <div className="text-[15px] font-semibold text-[#374151]">{it.title}</div>
                  <p className="text-sm text-gray-700 mt-1">{it.description}</p>
                </div>
              ))}
            </div>
          </div>


          {/* PC：左右（本番年表） */}
          <div className="max-w-6xl mx-auto hidden md:block">
            <AboutTimeline items={timelineItems} />
          </div>

        </div>
      </div>
    </section>
  );
}
