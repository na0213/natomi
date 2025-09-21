// app/works/1/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

import Header from 'components/Header';
import Footer from 'components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

export default function WorkPage1() {
  const router = useRouter();
  const handleNavigate = (sectionId: string) => router.push(`/#${sectionId}`);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header activeSection="works" onNavigate={handleNavigate} />

      <main className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* ===== ヘッダー部分の文言変更 ===== */}
            <div className="mb-8">
            <button
              onClick={() => router.push("/#works")}
              className="mb-4"
            >
              <Image
                src="/icons/arrow.png"
                alt="戻る"
                width={52}
                height={52}
                className="cursor-pointer wiggleIcon"
              />
            </button>

              <h1 className="text-3xl text-[#333] mb-2">Pet Commons（試作）</h1>
              <p className="text-gray-600">
                モバイルファーストで作る、飼い主コミュニティのLPデモ（HTML/CSS/JS + Vercel）
              </p>
                <Link
                href="https://pet-commons.vercel.app/" // ←公開URLに差し替え
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#3be7ed] hover:text-[#2dd4da] underline underline-offset-4"
              >
                WEBサイトへ
                <i className="ri-external-link-line text-sm" />
              </Link>
            </div>

            {/* ===== モック ===== */}
            <div className="mb-16">
              <div className="bg-[#F9F9F9] rounded-lg p-4 overflow-visible">
                {/* PCモック（高さを大きく調整） */}
                <div className="desktop-mockup mb-12">
                <div className="relative w-full p-2">
                  <Image
                    src="/works/petcommon/mobile.png"
                    alt="Pet Commons Desktop"
                    width={1600}
                    height={1000}
                    className="w-full h-auto object-cover rounded"
                    priority
                  />
                </div>
                </div>

                {/* PC画像 + スマホ画像の2分割（6:4） */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                  {/* 左（PC画像・少し小さめ） */}
                  <div className="md:col-span-3">
                    <div className="relative shadow-sm p-2">
                      <div className="rounded-lg h-[16rem] sm:h-[20rem] lg:h-[24rem] flex items-center justify-center overflow-hidden">
                        <Image
                          src="/works/petcommon/desktop.png"
                          alt="Pet Commons PC"
                          width={1000}
                          height={600}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 右（スマホ画像・少し小さめ） */}
                  <div className="md:col-span-2">
                    <div className="relative shadow-sm p-3 max-w-xs mx-auto">
                      {/* スマホ枠の上下バーも小さめ */}
                      <div className="h-4 flex items-center justify-center mb-2">
                        <span className="w-16 h-1"></span>
                      </div>
                      <div className="rounded-xl overflow-hidden">
                        <Image
                          src="/works/petcommon/mobile2.png"
                          alt="Pet Commons Mobile"
                          width={300}
                          height={700}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="flex items-center justify-center mt-2">
                        <span className="w-16 h-1"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* ===== 開発の流れ ===== */}
            <div className="mb-5">
              <h2 className="text-xl text-[#333] mb-6">開発の流れ</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-lightbulb-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-[#333] mb-2">設計</h3>
                  <p className="text-gray-600 text-sm">
                    紙ラフ &amp; ブラウザで直接プロトタイピング（モバイルファースト）
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-code-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-[#333] mb-2">開発・実装</h3>
                  <p className="text-gray-600 text-sm">
                    HTML / CSS / JavaScript。スムーズスクロール、ハンバーガー、スライダー
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-rocket-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-[#333] mb-2">公開</h3>
                  <p className="text-gray-600 text-sm">Vercel によるホスティング・プレビュー・本番公開</p>
                </div>
              </div>
            </div>

            {/* ===== 詳細 ===== */}
            <div className="bg-white p-8">
              <div className="grid grid-cols-1 gap-6">
                <InfoBlock title="ターゲット">
                  アニマルケアや暮らしの知見を素早く知りたい飼い主。ライト層でも迷わず情報に到達できる導線を重視。
                </InfoBlock>

                <InfoBlock title="課題">
                  知見がSNSや掲示板に分散して見つけづらい。検索条件と情報の整理が必要。
                </InfoBlock>

                <InfoBlock title="目的">
                  種類・年齢・テーマで迷子にならない導線設計の検証。操作時の気持ちよさも重視。
                </InfoBlock>

                <InfoBlock title="使用言語 / 技術">
                  HTML / CSS / JavaScript / Vercel
                </InfoBlock>

                <InfoBlock title="デザイン・実装上の工夫">
                  モバイルファーストで実装し、PCでは左サイド固定ナビを追加。  
                  スムーズスクロール + アクティブ状態の視覚化（足跡アイコンの濃淡切替）。  
                  画像は遅延読込・装飾はCSS/JSアニメーションで軽量化。
                </InfoBlock>
              </div>
            </div>

          </div>
        </div>
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}

/** 補助: セクション用の小コンポーネント（ページ内定義でもOK） */
function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className={`font-semibold text-[#333] mb-3 flex items-center ${styles.hoverIcon}`}>
        <i className={`ri-leaf-line text-[#3bc3ed] mr-2 ${styles.icon}`}></i>
        <span className="text-[#3bc3ed]">{title}</span>
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
