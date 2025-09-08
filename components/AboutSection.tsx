'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Briefcase, GraduationCap, Plus, X } from 'lucide-react';
import anim from './AboutSection.module.css';

/* =========================
   型定義 & タイムライン定数（コンポーネント外に移動）
   ========================= */
type Side = 'left' | 'right';
type RawItem = {
  side: Side;
  period: string;
  role?: string;
  school?: string;
  description: string;
};

const TIMELINE_ITEMS: RawItem[] = [
  { side: 'left',  period: '2025年〜',         role: 'ライター',                 description: 'Webメディア、広報ライター' },
  { side: 'left',  period: '〜2025年',         role: 'コミュニティマネージャー', description: '地域バイヤープログラムのコミュマネとして受講生とのコミュニケーションを担当' },
  { side: 'right', period: '2024年',           role: 'インタビューライター養成講座', description: '株式会社WHEREの講座。地域密着の取材執筆を行う' },
  { side: 'right', period: '2024年',           school: '地域バイヤープログラム',     description: '地域の生産者を訪問し、仕入れ、AKOMEYA TOKYOにてPOPUP販売' },
  { side: 'right', period: '2023年〜2024年',   school: "G's Devコース",             description: 'HTML/CSS/PHP/Laravelのほか、Next.js/Reactを学ぶ。' },
  { side: 'right', period: '2022年〜2022年',   school: 'SAMURAI ENGINEER エキスパートコース', description: 'HTML/CSS/PHP/Laravelを学ぶ。' },
  { side: 'left',  period: '2017年〜2024年',   school: '化粧品・健康食品メーカー',     description: '物流・品質管理業務。製品の品質向上に貢献' },
  { side: 'right', period: '〜2008年',         school: '生物資源科学修士',           description: '遺伝学。鯨類胎盤の女性ホルモンについて解析。' },
];

/* =========================
   ユーティリティ
   ========================= */
const parsePeriod = (period: string) => {
  const years = (period.match(/\d{4}(?=年)/g) || []).map(Number);
  const hasLeading = /^〜/.test(period);
  const hasTrailing = /〜$/.test(period);
  const currentYear = new Date().getFullYear();

  if (years.length === 2) {
    const [start, end] = years[0] <= years[1] ? years : [years[1], years[0]];
    return { start, end };
  }
  if (years.length === 1) {
    const y = years[0];
    if (hasTrailing) return { start: y, end: Math.max(y, currentYear) };
    if (hasLeading)  return { start: y - 1, end: y };
    return { start: y, end: y };
  }
  return { start: currentYear, end: currentYear };
};

type ParsedItem = RawItem & { start: number; end: number; title: string };
type Placed = { item: ParsedItem; top: number; height: number; bottom: number };

export default function AboutSection() {
  /* ========= 状態 ========= */
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lineHeight, setLineHeight] = useState(0);

  /* ========= カード内容 ========= */
  const cards = [
    {
      title: 'Animal',
      desc: 'フェレットと暮らしています。イヌ、ネコ、イルカ、ペンギン、ナマケモノなどなど、動物はだいたい好きです。',
      modal: 'フェレットと暮らしています。イヌ、ネコ、イルカ、ペンギン、ナマケモノなどなど、動物はだいたい好きです。',
      img: '/about/ferret.png',
    },
    {
      title: 'Running',
      desc: '時間があると川沿いを走ります。トレイルランニングで色々な山も走っています。',
      modal: '時間があると川沿いを走ります。トレイルランニングで色々な山も走っています。',
      img: '/about/run.png',
    },
    {
      title: 'Travel',
      desc: '地域の魅力を知る旅がすき。温泉やオーベルジュにこだわりのある宿探しをしています。',
      modal: '地域の魅力を知る旅がすき。温泉やオーベルジュにこだわりのある宿探しをしています。',
      img: '/about/trip.png',
    },
    {
      title: 'Fisshing',
      desc: '主に海釣り。アジからタイや本ガツオまで。魚は自ら捌いていただいています。',
      modal: '主に海釣り。アジからタイや本ガツオまで。魚は自ら捌いていただいています。',
      img: '/about/fish.png',
    },
  ];

  /* ========= Escでオーバーレイを閉じる ========= */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenCard(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ========= セクション可視でフェードイン ========= */
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    const element = document.getElementById('about');
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /* ========= スクロール進捗（中央線アニメ） ========= */
  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (!aboutSection) return;
      const sectionTop = aboutSection.offsetTop;
      const sectionHeight = aboutSection.offsetHeight;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionStart = sectionTop - windowHeight;
      const sectionEnd = sectionTop + sectionHeight;
      const progress = Math.min(Math.max((scrollPosition - sectionStart) / (sectionEnd - sectionStart), 0), 1);
      setLineHeight(progress * 100);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ========= タイムライン（不変の定数を使う） ========= */
  const timelineItems = TIMELINE_ITEMS;
  const workItems = useMemo(() => timelineItems.filter(i => i.side === 'left'), [timelineItems]);
  const eduItems  = useMemo(() => timelineItems.filter(i => i.side === 'right'), [timelineItems]);

  const parsedItems: ParsedItem[] = useMemo(() => {
    return timelineItems.map((it) => {
      const { start, end } = parsePeriod(it.period);
      return { ...it, start, end, title: it.role || it.school || '' };
    });
  }, [timelineItems]);

  const minYear = useMemo(() => Math.min(...parsedItems.map(i => i.start)), [parsedItems]);
  const maxYear = useMemo(() => Math.max(...parsedItems.map(i => i.end)),   [parsedItems]);
  const rangeYears = Math.max(1, maxYear - minYear + 1);
  const unit = 64; // 1年あたりの高さ(px)

  const { leftPlaced, rightPlaced, containerHeight } = useMemo(() => {
    const baseHeight = rangeYears * unit;
    const minBox = 140;
    const gap = 10;

    const placeSide = (side: Side): Placed[] => {
      const list = parsedItems
        .filter(i => i.side === side)
        .sort((a, b) => {
          const ta = (maxYear - a.end) * unit;
          const tb = (maxYear - b.end) * unit;
          if (ta !== tb) return ta - tb; // 新しい年が先
          const lenA = a.end - a.start;
          const lenB = b.end - b.start;
          return lenB - lenA; // 期間の長いものを先に
        });
      const placed: Placed[] = [];
      for (const it of list) {
        const baseTop = (maxYear - it.end) * unit;
        const height = Math.max(minBox, (it.end - it.start + 1) * unit - 8);
        let top = baseTop;
        const prev = placed[placed.length - 1];
        if (prev && top < prev.bottom + gap) top = prev.bottom + gap; // 重なり回避
        const bottom = top + height;
        placed.push({ item: it, top, height, bottom });
      }
      return placed;
    };

    const leftPlaced = placeSide('left');
    const rightPlaced = placeSide('right'); // ← const に変更（配列自体は再代入しない）

    // 左(2017-2024)と右(2024)の縦位置を揃える
    const leftTarget = leftPlaced.find(p => p.item.end === 2024);
    const rightIndex = rightPlaced.findIndex(p => p.item.end === 2024);
    if (leftTarget && rightIndex >= 0) {
      rightPlaced[rightIndex] = {
        ...rightPlaced[rightIndex],
        top: leftTarget.top,
        bottom: leftTarget.top + rightPlaced[rightIndex].height,
      };
      // 後続の重なり回避
      for (let i = rightIndex + 1; i < rightPlaced.length; i++) {
        const prev = rightPlaced[i - 1];
        if (rightPlaced[i].top < prev.bottom + gap) {
          const height = rightPlaced[i].height;
          rightPlaced[i].top = prev.bottom + gap;
          rightPlaced[i].bottom = rightPlaced[i].top + height;
        }
      }
    }

    const maxBottom = Math.max(
      baseHeight,
      leftPlaced.length ? leftPlaced[leftPlaced.length - 1].bottom : 0,
      rightPlaced.length ? rightPlaced[rightPlaced.length - 1].bottom : 0
    );
    return { leftPlaced, rightPlaced, containerHeight: maxBottom };
  }, [parsedItems, maxYear, rangeYears, unit]);

  /* ========= JSX ========= */
  return (
    <section id="about" className="py-20 bg-[#F9F9F9] mt-16 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className={`fade-in ${isVisible ? 'visible' : ''}`}>
          <h2 className="text-3xl font-bold text-center mb-16 text-[#333]">わ た し の こ と</h2>

          {/* プロフィール */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  <Image src="/natomi.png" alt="プロフィール写真" width={128} height={128} className="rounded-full object-cover object-top border-4 border-[#09dbd0]" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-[#333] mb-4">N a t o m i</h3>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      小さい頃から動物が大好き。大学では海洋学を専攻し、クジラや{' '}
                      <span className="relative inline-block group align-baseline">
                        <span className="font-semibold text-[#06becf]">イルカ</span>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -top-8 -right-8 opacity-0 scale-75 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                        >
                          <Image src="/icons/dolphin.png" alt="イルカアイコン" width={35} height={35} className="drop-shadow-md" />
                        </span>
                      </span>
                      の研究をしていました。
                    </p>

                    <p>
                      仕事は事務や大学病院での研究補助、化粧品・健康食品メーカーで物流管理や品質管理の仕事を経験。<br />
                      現在はライターとしても活動しています。
                    </p>

                    <p>
                      2022年よりプログラミングに興味をもち、個人開発を楽しむ日々。<br />
                      新しい技術を試すのが好きで、”使いやすくてちょっと{' '}
                      <span className="relative inline-block group align-baseline">
                        <span className="font-semibold text-[#06becf]">心が動く</span>
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -top-8 -right-8 opacity-0 scale-75 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                        >
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4枚のカード（タイトルのみ。descは非表示） */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {cards.map((c, i) => (
                <article
                  key={i}
                  className="group relative bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-full transition-shadow hover:shadow-md focus-within:shadow-md"
                >
                  <h4 className="text-base font-semibold text-[#333]">{c.title}</h4>

                  {/* 右下の➕：ホバーで45°＋サイズ拡大 */}
                  <button
                    type="button"
                    aria-label={`${c.title} の詳細を開く`}
                    onClick={() => setOpenCard(i)}
                    className="absolute bottom-4 right-4 grid place-items-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#09dbd0]/30"
                  >
                    <Plus
                      className="text-[#696969] w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 ease-out hover:rotate-45 hover:scale-125"
                      strokeWidth={5}
                    />
                  </button>
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
                className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
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

                {/* 左上から出てくる画像（横揺れアニメ） */}
                <div className="absolute -top-8 -left-8">
                  <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden ${anim.popIn}`}>
                    <Image
                      src={cards[openCard].img}
                      alt={`${cards[openCard].title} のイメージ`}
                      fill
                      sizes="112px"
                      className={`object-cover ${anim.sway}`}
                      priority
                    />
                  </div>
                </div>

                {/* 本文（画像が被らないよう余白） */}
                <div className="mt-12 sm:mt-16 ml-16 sm:ml-20">
                  <p className="text-gray-700 leading-relaxed">
                    {cards[openCard].modal}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* スマホ：上下 */}
          <div className="space-y-12 md:hidden">
            <div>
              <h3 className="flex items-center justify-center md:justify-start text-base md:text-xl font-bold text-[#06becf] mb-2 md:mb-4">
                <Briefcase className="w-5 h-5 mr-2" />
                しごと
              </h3>
              <div className="space-y-6">
                {workItems.map((item, i) => (
                  <div key={`work-${i}`} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-sm text-[#808080] font-medium mb-2">{item.period}</div>
                    <h4 className="text-lg font-semibold text-[#333] mb-2">{item.role || item.school}</h4>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="flex items-center justify-center md:justify-start text-base md:text-xl font-bold text-[#066bcf] mb-2 md:mb-4">
                <GraduationCap className="w-5 h-5 mr-2" />
                まなび
              </h3>
              <div className="space-y-6">
                {eduItems.map((item, i) => (
                  <div key={`edu-${i}`} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-sm text-[#808080] font-medium mb-2">{item.period}</div>
                    <h4 className="text-lg font-semibold text-[#333] mb-2">{item.role || item.school}</h4>
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PC：左右（年数比例） */}
          <div className="max-w-6xl mx-auto hidden md:block">
            <div className="relative">
              <div className="flex w-full mb-4">
                <div className="w-1/2 flex justify-center">
                  <h3 className="text-xl font-bold text-[#06becf] flex items-center gap-2">
                    <Briefcase className="w-5 h-5" /> しごと
                  </h3>
                </div>
                <div className="w-1/2 flex justify-center">
                  <h3 className="text-xl font-bold text-[#066bcf] flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" /> まなび
                  </h3>
                </div>
              </div>

              <div className="relative" style={{ height: containerHeight }}>
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-300" />
                <div className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-[#09dbd0] transition-all duration-300 ease-out" style={{ height: `${lineHeight}%` }} />

                <div className="absolute inset-y-0 left-0 w-1/2 pr-8">
                  {leftPlaced.map((placed, idx) => {
                    const { item, top, height } = placed;
                    return (
                      <div key={`L-${idx}`} className="absolute left-0 right-8 text-right" style={{ top, height }}>
                        <div className="bg-white p-4 rounded-lg shadow-sm mr-8 h-full flex flex-col justify-center">
                          <div className="text-sm text-[#808080] font-medium mb-1">{item.period}</div>
                          <h4 className="text-base font-semibold text-[#333] mb-1">{item.title}</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="absolute inset-y-0 right-0 w-1/2 pl-8">
                  {rightPlaced.map((placed, idx) => {
                    const { item, top, height } = placed;
                    return (
                      <div key={`R-${idx}`} className="absolute right-0 left-8 text-left" style={{ top, height }}>
                        <div className="bg-white p-4 rounded-lg shadow-sm ml-8 h-full flex flex-col justify-center">
                          <div className="text-sm text-[#808080] font-medium mb-1">{item.period}</div>
                          <h4 className="text-base font-semibold text-[#333] mb-1">{item.title}</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 中央線上のドット（左右で色分け） */}
                <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-0">
                  {leftPlaced.map((p, i) => (
                    <span
                      key={`DL-${i}`}
                      aria-hidden
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#06becf] ring-2 ring-white shadow"
                      style={{ top: p.top + p.height / 2 }}
                    />
                  ))}
                  {rightPlaced.map((p, i) => (
                    <span
                      key={`DR-${i}`}
                      aria-hidden
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#066bcf] ring-2 ring-white shadow"
                      style={{ top: p.top + p.height / 2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
