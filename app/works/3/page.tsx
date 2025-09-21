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

              <h1 className="text-3xl text-[#333] mb-2">ポートフォリオ</h1>
              <p className="text-gray-600">
                ポートフォリオサイト
              </p>
                <Link
                href="https://www.natomi.work/" // ←公開URLに差し替え
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
                <div className="desktop-mockup mb-2">
                <div className="desktop-mockup mb-2">
                <div className="relative w-full p-2"> 
                  <Image
                        src="/works/portfolio/portfolio.png"
                        alt="Pet Commons Desktop"
                        width={1600}
                        height={1000}
                        className="w-full h-full object-contain rounded"
                        priority
                      />
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
                    目的（実績・強みを素早く伝える）を軸に、情報設計とナビゲーション動線を整理
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-code-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-[#333] mb-2">開発・実装</h3>
                  <p className="text-gray-600 text-sm">
                    Next.js / React / TypeScript / Tailwind CSS を用いた実装
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-rocket-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-[#333] mb-2">公開</h3>
                  <p className="text-gray-600 text-sm">Vercel でプレビュー & 本番デプロイ</p>
                </div>
              </div>
            </div>

            {/* ===== 詳細 ===== */}
            <div className="bg-white p-8">
              <div className="grid grid-cols-1 gap-6">
                <InfoBlock title="ターゲット">
                  自身の活動やスキルを伝えるポートフォリオとして設計。クライアントに直感的に内容が伝わるUIを重視。
                </InfoBlock>

                <InfoBlock title="課題">
                  情報量が多くなると閲覧者が迷子になりやすい。カテゴリー分けと視覚的な導線が必要。
                </InfoBlock>

                <InfoBlock title="目的">
                  制作物や経歴を整理して見せることで、自分のスキルセットを効果的にアピールする。<br />
                  レスポンシブ対応で、PC/スマホどちらでも快適に閲覧できるよう設計。
                </InfoBlock>

                <InfoBlock title="使用言語 / 技術">
                  Next.js / React / TypeScript / Tailwind CSS / Vercel
                </InfoBlock>

                <InfoBlock title="デザイン・実装上の工夫">
                  スクロール時のアニメーションを実装。<br />
                  再利用可能なUI片をコンポーネント化し、スケールしても保守しやすい構造に。
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
