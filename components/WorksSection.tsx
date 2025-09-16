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
    id: '2',
    title: 'Pet Commons（試作）',
    description: 'Webサイト，自主制作',
    category: 'LP',
    videoSrc: '/works/petcommon/petcommon.mp4',
    mockups: {
      mobile: '/works/1/mobile.png',
      desktop: '/works/1/desktop.png',
    },
  },
  {
    id: '3',
    title: 'ポートフォリオ',
    description: 'ポートフォリオサイト，自主制作',
    category: 'ポートフォリオ',
    videoSrc: '/works/petcommon/petcommon.mp4',
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
            <p className="text-lg text-[#86888a] font-bold">{w.category}</p>
          {w.id === '3' ? (
            // ===== id=3：画像3枚のスタイリッシュレイアウト =====
<Link href={`/works/${w.id}`} className="block">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 左：モバイルでは横並び2枚、PCでは縦並び */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:col-span-1">
        <Image
          src="/works/portfolio/mobile.png"
          alt={`${w.title} モバイル画面`}
          width={300}
          height={400}
          className="w-full h-auto object-cover rounded md:max-w-[80%] md:mx-auto"
        />
        <Image
          src="/works/portfolio/mobile2.png"
          alt={`${w.title} モバイル画面 2`}
          width={300}
          height={400}
          className="w-full h-auto object-cover rounded md:max-w-[80%] md:mx-auto"
        />
      </div>

                {/* 右：大きな1枚 */}
                <div className="md:col-span-2">
                  <Image
                    src="/works/portfolio/desktop.png" // ←大きいPC用
                    alt={`${w.title} デスクトップ画面`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover rounded md:max-w-[80%] md:mx-auto"
                  />
                </div>
              </div>
            </Link>
          ) :w.id === '2' ? (
              // ===== id=2：動画のみを中央配置（その他は削除） =====
              <Link href={`/works/${w.id}`} className="block">
                <div className="w-full flex justify-center">
                  <div className="w-full max-w-4xl">
                    <video
                      src={w.videoSrc}
                      autoPlay
                      loop
                      muted
                      preload="metadata"
                      playsInline
                      className="w-full h-auto object-contain rounded-lg overflow-hidden"
                    />
                  </div>
                </div>
              </Link>
            ) : (
              // ===== それ以外（id=1 など）：従来レイアウト維持 =====
              <Link href={`/works/${w.id}`} className="block">
                <div className="flex flex-col md:flex-row items-center md:items-start">
                  {/* 左：大きめ GIF/動画 プレビュー */}
                  <div className="w-full md:w-3/5">
                    <video
                      src={w.videoSrc}
                      autoPlay
                      loop
                      muted
                      preload="metadata"
                      playsInline
                      className="w-full h-auto object-cover rounded-lg overflow-hidden"
                    />
                  </div>
                  {/* 中央の余白 */}
                  <div className="hidden md:block md:w-1/12" />
                  {/* 右：モックアップ画像2列 */}
                  <div className="w-full md:w-2/5 grid grid-cols-2 gap-4">
                    <Image
                      src={w.mockups.mobile}
                      alt={`${w.title} モバイルモック`}
                      width={300}
                      height={200}
                      className="w-full h-auto object-cover rounded md:max-w-[80%] md:mx-auto"
                    />
                    <Image
                      src={w.mockups.desktop}
                      alt={`${w.title} デスクトップモック`}
                      width={300}
                      height={200}
                      className="w-full h-auto object-cover rounded md:max-w-[80%] md:mx-auto"
                    />
                  </div>
                </div>
              </Link>
            )}

            {/* タイトル & 説明（共通で残す場合） */}
            <div className="px-2 md:px-0">
              <h3 className="text-xl text-[#333]">{w.title}</h3>
              <p className="text-sm text-gray-600">{w.description}</p>
            </div>
          </div>
        ))}


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
