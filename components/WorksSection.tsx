'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import WorkCard, { type WorkCardItem } from './WorkCard';

interface WorkItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'site' | 'app' | 'interactive';
  videoSrc?: string;
  imageSrc?: string;
  href?: string;
  external?: boolean;                // 詳細ページを挟まず、公開中のサイトへ
  ratio?: number;                   // メディアの縦横比（分解図の層をそろえる）
  layers?: WorkCardItem['layers'];   // 重ねて見せる実際のページ（サイト／アプリの中の言葉）
  phone?: boolean;                   // スマホ画面
}

const works: WorkItem[] = [
  {
    id: '1',
    title: 'ウェルフェアFARM',
    description: '福祉と農をつなぐ活動を、やさしい余白と動きで伝える自主制作サイト。',
    category: 'WEBサイト',
    type: 'site',
    videoSrc: '/works/1/work1.mp4',
    href: '/works/1',
    ratio: 1024 / 798,
    layers: {
      top: 'STORY',
      mid: { label: '牧場検索', src: '/works/1/page-search.jpg' },
      bottom: { label: 'NOTE', src: '/works/1/page-note.jpg' },
    },
  },
  {
    id: '3',
    title: 'ポートフォリオ',
    description: 'ライティング、Web開発、AI表現をまとめる自分自身の制作拠点。',
    category: 'Portfolio',
    type: 'site',
    videoSrc: '/works/portfolio/site-pc.mp4',
    href: '/works/3',
    ratio: 1100 / 798,
    layers: {
      top: 'わくわくすること',
      mid: { label: 'ABOUT', src: '/works/portfolio/page-timeline.jpg' },
      bottom: { label: 'SKILLS', src: '/works/portfolio/page-skills.jpg' },
    },
  },
  {
    id: 'pushly',
    title: 'Pushly',
    description: '予約、サブスク、健診、更新日 忘れがちな予定のためのリマインダー',
    category: 'iPhoneアプリ',
    type: 'app',
    imageSrc: '/works/pushly/screen-home.jpg',
    href: '/works/pushly',
    ratio: 640 / 1387,
    phone: true,
    layers: {
      top: '予定',
      mid: { label: '通知タイミング', src: '/works/pushly/screen-detail.jpg' },
      bottom: { label: 'カテゴリ管理', src: '/works/pushly/screen-category.jpg' },
    },
  },
  {
    id: 'shinsouku',
    title: '深層区',
    description: '水深3,208mの沈降市街を、7つの視点から探索できる3D作品。',
    category: '3D・インタラクティブ',
    type: 'interactive',
    imageSrc: '/works/shinsouku/view1.jpg',
    href: 'https://shinsouku.natomi.work/',
    external: true,
    ratio: 1600 / 1000,
  },
  {
    id: 'hakoniwa',
    title: '本日の太陽系',
    description: '今日の日付どおりの天体の位置を、3Dで眺められる太陽系。',
    category: '3D・インタラクティブ',
    type: 'interactive',
    imageSrc: '/works/hakoniwa/view1.jpg',
    href: 'https://hakoniwa.natomi.work/',
    external: true,
    ratio: 1600 / 1000,
  },
  {
    id: 'punien',
    title: 'ぷにえん',
    description: 'ぷにぷにのどうぶつを、つついたり、ひっぱって投げたりして遊べる広場。',
    category: 'インタラクティブ',
    type: 'interactive',
    imageSrc: '/works/punien/view1.jpg',
    href: 'https://punien.natomi.work/',
    external: true,
    ratio: 1600 / 1000,
  },
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'site', label: 'Web Site' },
  { id: 'app', label: 'Apps' },
  { id: 'interactive', label: 'Interactive' },
] as const;

type FilterId = (typeof filters)[number]['id'];

export default function WorksSection() {
  const [filter, setFilter] = useState<FilterId>('all');

  const filteredWorks = works.filter((work) => filter === 'all' || work.type === filter);

  return (
    <section id="works" className="bg-[#f6fbfb] py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#08aeb8]">WORKS</p>
          <h2 className="text-3xl text-[#243033]">つくったもの</h2>

          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-b border-[#cce7e8] px-2">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`relative px-1 pb-3 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08aeb8]/30 ${
                  filter === item.id
                    ? 'text-[#08aeb8] after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-full after:bg-[#08aeb8]'
                    : 'text-[#627174] hover:text-[#08aeb8]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorks.map((work) =>
            work.ratio ? <WorkCard key={work.id} work={{ ...work, ratio: work.ratio }} /> : null
          )}

          <div className="flex min-h-[420px] flex-col justify-between border border-dashed border-[#9bd9dc] bg-white/70 p-8">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center bg-[#e6fafa] text-[#08aeb8]">
                <Plus className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-xs font-bold tracking-[0.28em] text-[#08aeb8]">COMING NEXT</p>
              <h3 className="mt-4 text-2xl font-semibold text-[#243033]">随時追加予定</h3>
              <p className="mt-5 text-sm leading-8 text-[#5d686b]">
                つくったものを、ここに少しずつ増やしていきます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
