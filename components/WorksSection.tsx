'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WorkModal from './WorkModal';

interface WorkItem {
  id: string;
  title: string;
  description: string;
  category: string;
  videoSrc: string;
  mockups: {
    mobile: string;
    desktop: string;
  };
  isAi?: boolean;
  thumbnail?: string;
  aiTools?: string;
  modalMedia?: string;
}

const works: WorkItem[] = [
  {
    id: '1',
    title: 'ウェルフェアFARM',
    description: 'Webサイト，自主制作',
    category: 'WEBサイト',
    videoSrc: '/works/1/work1.mp4',
    mockups: {
      mobile: '/works/1/mobile.png',
      desktop: '/works/1/desktop.png',
    },
  },

  {
    id: 'ai-1',
    title: 'AI生成キャラクターイラスト',
    description: 'MidjourneyとPhotoshopを活用した生成AIイラスト作品。',
    category: '生成AI',
    thumbnail: '/works/ai-1/ai-3.png',
    isAi: true,
    modalMedia: '/works/ai-1/ai-3.png',
    aiTools: 'Midjourney, Photoshop',
    videoSrc: '',
    mockups: { mobile: '', desktop: '' },
  },
];

export default function WorksSection() {
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const normal = works.filter(w => !w.isAi);
  const aiList = works.filter(w => w.isAi);

  return (
    <section id="works" className="py-20 bg-[#F5F5F5] scroll-mt-24">
      <div className="container mx-auto px-4 space-y-16">
        <h2 className="text-3xl font-bold text-center text-[#333] tracking-widest">
          さ　く　ひ　ん
        </h2>

        {normal.map(w => (
          <div key={w.id} className="space-y-4">
            <p className="text-lg text-[#86888a]">{w.category}</p>
            <Link href={`/works/${w.id}`} className="block">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                {/* 左：大きめ GIF プレビュー */}
                <div className="w-full md:w-3/5">
                  <video src={w.videoSrc} autoPlay loop muted preload="metadata" playsInline className="w-full h-auto object-cover rounded-lg overflow-hidden"/>
                </div>
                {/* 中央の余白 */}
                <div className="hidden md:block md:w-1/12" />
                {/* 右：モックアップ画像2列 */}
                <div className="w-full md:w-2/5 grid grid-cols-2 gap-4">
                  <Image src={w.mockups.mobile} alt={`${w.title} モバイルモック`} width={300} height={200} className="w-full h-auto object-cover rounded"/>
                  <Image src={w.mockups.desktop} alt={`${w.title} デスクトップモック`} width={300} height={200} className="w-full h-auto object-cover rounded"/>
                </div>
              </div>
            </Link>
            <div className="px-2 md:px-0">
              <h3 className="text-xl font-semibold text-[#333]">{w.title}</h3>
              <p className="text-sm text-gray-600">{w.description}</p>
            </div>
          </div>
        ))}

        {/* 生成AI作品 */}
        <div>
          <p className="text-lg text-[#86888a] mb-4">生成AI</p>
          <div className="overflow-x-auto">
            <div className="flex gap-4 w-max">
              {aiList.map(w => (
                <div
                  key={w.id}
                  className="min-w-[260px] rounded-lg transition cursor-pointer"
                  onClick={() => setSelected(w)}
                >
                  <Image
                    src={w.thumbnail!}
                    alt={w.title}
                    width={260}
                    height={160}
                    className="w-full h-40 object-cover rounded"
                  />
                  <div className="p-3">
                    <h4 className="text-sm font-medium">{w.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* モーダル */}
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
