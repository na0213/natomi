'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// app/works/1/page.tsx から見た相対パス
import Header from 'components/Header';
import Footer from 'components/Footer';

export default function WorkPage1() {
  const router = useRouter();

  // Header の onNavigate(sectionId) に対応
  const handleNavigate = (sectionId: string) => {
    router.push(`/#${sectionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ヘッダー（props 必須想定） */}
      <Header activeSection="works" onNavigate={handleNavigate} />

      <main className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link href="/#works" className="inline-flex items-center text-[#3be7ed] hover:text-[#2dd4da] mb-4">
                <i className="ri-arrow-left-line mr-2"></i>
                戻る
              </Link>
              <h1 className="text-3xl text-[#333] mb-2">ウェルフェアFARM</h1>
              <p className="text-gray-600">アニマルウェルフェアを中心とした牧場訪問サイト</p>
            </div>

            {/* === ここから：1カラム構成に統一 === */}
            <div className="mb-16">
              <div className="bg-[#F9F9F9] rounded-lg p-4 overflow-visible">
                {/* Desktop mockup */}
                <div className="desktop-mockup mb-8">
                  <div className="relative bg-[#ffffff] rounded-t-lg p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div className="bg-white rounded h-56 md:h-72 lg:h-80 flex items-center justify-center overflow-hidden">
                      <Image
                        src="/works/1/work_pc.jpg"
                        alt="Desktop Mockup"
                        width={600}
                        height={400}
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile mockups: 1列→2列→3列 */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {/* 1枚目（Scrollあり） */}
                  <div className="flex flex-col items-start w-full max-w-[15rem]">
                    {/* 共通ヘッダー行：ここだけ中身あり */}
                    <div className="h-6 sm:h-7 lg:h-9 mb-8 flex items-start">
                      <div className={styles.floatY}>
                        <div className={`${styles.fukidashi} whitespace-nowrap text-gray-700 text-xs lg:text-lg font-semibold`}>
                          Scroll
                        </div>
                      </div>
                    </div>
                    <div className="relative bg-[#ffffff] rounded-2xl p-3 w-full">
                      <div className="bg-white rounded-xl h-96 overflow-y-auto">
                        <Image
                          src="/works/1/scroll1.png"
                          alt="Mobile Mockup 1"
                          width={300}
                          height={1000}
                          className="w-full h-auto rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2枚目（Scrollなし） */}
                  <div className="flex flex-col items-start w-full max-w-[15rem]">
                    {/* 共通ヘッダー行：空ダミーで同じ高さを確保 */}
                    <div className="h-6 sm:h-7 lg:h-9 mb-8" />
                    <div className="relative bg-[#ffffff] rounded-2xl p-3 w-full">
                      <div className="bg-white rounded-xl h-96 overflow-y-auto">
                        <Image
                          src="/works/1/scroll2.png"
                          alt="Mobile Mockup 2"
                          width={300}
                          height={1000}
                          className="w-full h-auto rounded-xl"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3枚目（Scrollなし） */}
                  <div className="flex flex-col items-start w-full max-w-[15rem]">
                    {/* 共通ヘッダー行：空ダミーで同じ高さを確保 */}
                    <div className="h-6 sm:h-7 lg:h-9 mb-8" />
                    <div className="relative bg-[#ffffff] rounded-2xl p-3 w-full">
                      <div className="bg-white rounded-xl h-96 overflow-y-auto">
                        <Image
                          src="/works/1/scroll3.png"
                          alt="Mobile Mockup 3"
                          width={300}
                          height={1000}
                          className="w-full h-auto rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 以降のセクションはそのまま */}
            <div className="mb-5">
              <h2 className="text-xl text-[#333] mb-6">開発の流れ</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-lightbulb-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-[#333] mb-2">企画・設計</h3>
                  <p className="text-gray-600 text-sm">Figmaを使用したワイヤーフレーム作成</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-code-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-[#333] mb-2">開発・実装</h3>
                  <p className="text-gray-600 text-sm">レスポンシブデザインでのコーディング</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-rocket-line text-white text-xl"></i>
                  </div>
                  <h3 className="font-semibold text-[#333] mb-2">公開</h3>
                  <p className="text-gray-600 text-sm">Herokuを用いたデプロイ</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="mb-4">
                  <h3 className={`font-semibold text-[#333] mb-3 flex items-center ${styles.hoverIcon}`}>
                    <i className={`ri-leaf-line text-[#3bc3ed] mr-2 ${styles.icon}`}></i>
                    <div className="text-[#3bc3ed]">ターゲット</div>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    アニマルウェルフェアや環境配慮に関心のある消費者<br />
                    牧場の取り組みを知りたい一般の方、学生、食や環境に関心のある層
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className={`font-semibold text-[#333] mb-3 flex items-center ${styles.hoverIcon}`}>
                    <i className={`ri-leaf-line text-[#3bc3ed] mr-2 ${styles.icon}`}></i>
                    <div className="text-[#3bc3ed]">課題</div>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    日常で口にする畜産物の背景や飼育環境を知る機会が少ない<br />
                    消費者と生産者の距離が遠く、取り組みが伝わりにくい
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className={`font-semibold text-[#333] mb-3 flex items-center ${styles.hoverIcon}`}>
                    <i className={`ri-leaf-line text-[#3bc3ed] mr-2 ${styles.icon}`}></i>
                    <div className="text-[#3bc3ed]">目的</div>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    命の育ち方や飼育の大切さを伝え、消費者に「食べること」と「環境」への意識を広げること<br />
                    牧場のアニマルウェルフェアの取り組みを可視化し、共感を生むこと
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className={`font-semibold text-[#333] mb-3 flex items-center ${styles.hoverIcon}`}>
                    <i className={`ri-leaf-line text-[#3bc3ed] mr-2 ${styles.icon}`}></i>
                    <div className="text-[#3bc3ed]">使用言語 / 技術</div>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    PHP（Laravel） / HTML / CSS / JavaScript / AWS S3（画像ストレージ）
                  </p>
                </div>

                <div>
                  <h3 className={`font-semibold text-[#333] mb-3 flex items-center ${styles.hoverIcon}`}>
                    <i className={`ri-leaf-line text-[#3bc3ed] mr-2 ${styles.icon}`}></i>
                    <div className="text-[#3bc3ed]">プロセス（デザイン上の工夫）</div>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    写真や文章をシンプルに配置し、牧場の雰囲気が伝わる柔らかいデザインを心がけました<br />
                    色味や余白を大切にし、落ち着いたトーンで安心感を演出しています
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* フッター */}
      <Footer />
    </div>
  );
}
