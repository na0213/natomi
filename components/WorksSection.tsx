'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Plus } from 'lucide-react';
import WorkModal from './WorkModal';

interface WorkItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'site' | 'app' | 'ai';
  videoSrc?: string;
  imageSrc?: string;
  href?: string;
  thumbnail?: string;
  isAi?: boolean;
  aiTools?: string;
  modalMedia?: string;
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
  },
  {
    id: '2',
    title: 'Pet Commons（試作）',
    description: 'ペットとの暮らしを起点にしたコミュニティサービスのLP試作。',
    category: 'LP / サービス構想',
    type: 'site',
    videoSrc: '/works/petcommon/petcommon.mp4',
    href: '/works/2',
  },
  {
    id: '3',
    title: 'ポートフォリオ',
    description: 'ライティング、Web開発、AI表現をまとめる自分自身の制作拠点。',
    category: 'Portfolio',
    type: 'site',
    imageSrc: '/works/portfolio/desktop.png',
    href: '/works/3',
  },
  {
    id: 'ai-1',
    title: 'AI生成キャラクターイラスト',
    description: 'MidjourneyとPhotoshopを活用した生成AIイラスト作品。',
    category: '生成AI',
    type: 'ai',
    thumbnail: '/works/ai-1/ai-3.png',
    isAi: true,
    modalMedia: '/works/ai-1/ai-3.png',
    aiTools: 'Midjourney, Photoshop',
  },
];

const filters = [
  { id: 'all', label: 'All' },
  { id: 'site', label: 'Web Site' },
  { id: 'app', label: 'Apps' },
] as const;

type FilterId = (typeof filters)[number]['id'];

const aiWorks = works.filter((work) => work.type === 'ai');
const aiMarqueeItems = [
  ...aiWorks,
  { id: 'ai-soon-1', title: 'Coming soon', description: 'AI visual note', category: '生成AI', type: 'ai' as const },
  { id: 'ai-soon-2', title: 'Coming soon', description: 'Movie / image study', category: '生成AI', type: 'ai' as const },
  { id: 'ai-soon-3', title: 'Coming soon', description: 'Small experiment', category: '生成AI', type: 'ai' as const },
];

export default function WorksSection() {
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const [filter, setFilter] = useState<FilterId>('all');

  const mainWorks = works.filter((work) => work.type !== 'ai');
  const filteredWorks = mainWorks.filter((work) => filter === 'all' || work.type === filter);
  const marqueeItems = [...aiMarqueeItems, ...aiMarqueeItems];

  return (
    <section id="works" className="bg-[#f6fbfb] py-20 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#08aeb8]">WORKS</p>
          <h2 className="text-3xl text-[#243033]">つくったもの</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5e6a6d]">
              サイト、アプリ、AI表現を、ひとつずつ標本のように並べていく場所です。
              これから増える個人開発も同じギャラリーに追加していきます。
          </p>

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
          {filteredWorks.map((work) => {
            const media = (
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#eceeee] p-8 md:p-10">
                {work.videoSrc ? (
                  <video
                    src={work.videoSrc}
                    autoPlay
                    loop
                    muted
                    preload="metadata"
                    playsInline
                    className="max-h-[74%] w-full object-contain shadow-sm transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <Image
                    src={work.imageSrc || work.thumbnail || ''}
                    alt={`${work.title} のプレビュー`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain p-10 transition duration-500 group-hover:scale-[1.04]"
                  />
                )}
                <span className="absolute left-5 top-5 bg-white/92 px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#087f86] shadow-sm">
                  {work.category}
                </span>
              </div>
            );

            const body = (
              <>
                {media}
                <div className="flex min-h-[148px] flex-col bg-[#eceeee] px-6 pb-6 pt-1 text-[#172225]">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">{work.title}</h3>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[#08aeb8]" aria-hidden="true" />
                  </div>
                  <p className="text-sm leading-7 text-[#4c585b]">{work.description}</p>
                  <p className="mt-auto pt-5 text-xs font-bold tracking-[0.2em] text-[#08aeb8]">
                    VIEW DETAIL
                  </p>
                </div>
              </>
            );

            return (
              <Link
                key={work.id}
                href={work.href || `/works/${work.id}`}
                className="group overflow-hidden bg-[#eceeee] transition hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3be7ed]/70"
              >
                {body}
              </Link>
            );
          })}

          <div className="flex min-h-[420px] flex-col justify-between border border-dashed border-[#9bd9dc] bg-white/70 p-8">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center bg-[#e6fafa] text-[#08aeb8]">
                <Plus className="h-6 w-6" aria-hidden="true" />
              </div>
              <p className="text-xs font-bold tracking-[0.28em] text-[#08aeb8]">COMING NEXT</p>
              <h3 className="mt-4 text-2xl font-semibold text-[#243033]">個人開発アプリを追加予定</h3>
              <p className="mt-5 text-sm leading-8 text-[#5d686b]">
                つくったものを、ここに少しずつ増やしていきます。
              </p>
            </div>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#176b70] hover:text-[#08aeb8]"
            >
              制作について相談する
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-6xl overflow-hidden border-t border-[#cce7e8] pt-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-xs font-bold tracking-[0.24em] text-[#08aeb8]">AI / VISUAL</p>
            <p className="text-xs text-[#6b777a]">small experiments</p>
          </div>

          <div className="relative -mx-4 overflow-hidden px-4">
            <div className="ai-marquee-track flex w-max gap-4">
              {marqueeItems.map((item, index) => {
                const isRealWork = Boolean(item.isAi && item.modalMedia);

                const card = (
                  <div className="flex h-32 w-52 shrink-0 items-center gap-3 bg-white/80 p-3 shadow-sm ring-1 ring-[#dce8e8]">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#e6fafa]">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={`${item.title} のサムネイル`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[#9bd9dc]">
                          +
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold tracking-[0.16em] text-[#08aeb8]">{item.category}</p>
                      <h3 className="mt-1 truncate text-sm font-semibold text-[#243033]">{item.title}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#657174]">{item.description}</p>
                    </div>
                  </div>
                );

                if (!isRealWork) {
                  return <div key={`${item.id}-${index}`}>{card}</div>;
                }

                return (
                  <button
                    key={`${item.id}-${index}`}
                    type="button"
                    onClick={() => setSelected(item)}
                    className="text-left transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#08aeb8]/40"
                  >
                    {card}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {selected && (
          <WorkModal
            isOpen
            onClose={() => setSelected(null)}
            work={{
              title: selected.title,
              modalMedia: selected.modalMedia!,
              aiTool: selected.aiTools!,
              description: selected.description,
            }}
          />
        )}
      </div>
    </section>
  );
}
