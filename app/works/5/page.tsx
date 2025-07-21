import Link from 'next/link';
export default function WorkPage5() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/#works" className="inline-flex items-center text-[#3be7ed] hover:text-[#2dd4da] mb-4">
              <i className="ri-arrow-left-line mr-2"></i>
              戻る
            </Link>
            <h1 className="text-3xl font-bold text-[#333] mb-2">個人開発 Webサイト</h1>
            <p className="text-gray-600">中小企業向けECサイト開発プロジェクト</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="device-showcase">
              <div className="desktop-mockup mb-8">
                <div className="relative bg-gray-900 rounded-t-lg p-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-white rounded h-80 flex items-center justify-center">
                    <img
                      src="https://readdy.ai/api/search-image?query=modern%20e-commerce%20website%20desktop%20mockup%2C%20clean%20interface%20design%2C%20professional%20business%20website%2C%20cyan%20color%20scheme%2C%20product%20showcase%20layout%2C%20responsive%20design&width=600&height=400&seq=desktop-mock&orientation=landscape"
                      alt="Desktop Mockup"
                      className="w-full h-full object-cover object-top rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="mobile-mockup lg:ml-8">
                <div className="relative bg-gray-900 rounded-2xl p-3 w-60 mx-auto">
                  <div className="bg-white rounded-xl h-96 flex items-center justify-center">
                    <img
                      src="https://readdy.ai/api/search-image?query=mobile%20e-commerce%20website%20interface%2C%20responsive%20design%2C%20smartphone%20mockup%2C%20modern%20UI%20design%2C%20cyan%20accents%2C%20clean%20layout%2C%20professional%20mobile%20app&width=300&height=500&seq=mobile-mock&orientation=portrait"
                      alt="Mobile Mockup"
                      className="w-full h-full object-cover object-top rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="project-details">
              <div className="bg-[#F9F9F9] rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-[#333] mb-4">プロジェクト概要</h2>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-[#333] min-w-24 mb-1 sm:mb-0">使用言語:</span>
                    <span className="text-gray-700">HTML, CSS, JavaScript, PHP, Laravel</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-[#333] min-w-24 mb-1 sm:mb-0">ターゲット:</span>
                    <span className="text-gray-700">中小企業の小規模ECサイト運営者</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="font-medium text-[#333] min-w-24 mb-1 sm:mb-0">意識したこと:</span>
                    <span className="text-gray-700">レスポンシブデザインと高速表示、直感的なUI/UX</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[#333] mb-4">参考ポートフォリオ例</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#3be7ed] pl-4">
                    <h3 className="font-medium text-[#333] mb-1">MALLOC Lab Portfolio</h3>
                    <p className="text-gray-600 text-sm mb-2">ダイナミックなインタラクションとビジュアルアニメーション</p>
                    <a href="https://example.com/malloc" className="text-[#3be7ed] hover:text-[#2dd4da] text-sm inline-flex items-center">
                      サイトを見る
                      <i className="ri-external-link-line ml-1"></i>
                    </a>
                  </div>
                  <div className="border-l-4 border-[#3be7ed] pl-4">
                    <h3 className="font-medium text-[#333] mb-1">Sophie's Developer Site</h3>
                    <p className="text-gray-600 text-sm mb-2">クリーンなレイアウトと詳細なプロジェクトケーススタディ</p>
                    <a href="https://example.com/sophie" className="text-[#3be7ed] hover:text-[#2dd4da] text-sm inline-flex items-center">
                      サイトを見る
                      <i className="ri-external-link-line ml-1"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F9F9F9] rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-[#333] mb-6">開発の流れ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#3be7ed] rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-lightbulb-line text-white text-xl"></i>
                </div>
                <h3 className="font-semibold text-[#333] mb-2">企画・設計</h3>
                <p className="text-gray-600 text-sm">ユーザーニーズの分析とワイヤーフレーム作成</p>
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
                <h3 className="font-semibold text-[#333] mb-2">テスト・公開</h3>
                <p className="text-gray-600 text-sm">パフォーマンス最適化とデプロイ</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-[#333] mb-6">技術的な特徴</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-[#333] mb-3 flex items-center">
                  <i className="ri-smartphone-line text-[#3be7ed] mr-2"></i>
                  レスポンシブデザイン
                </h3>
                <p className="text-gray-600 text-sm">デスクトップからモバイルまで、あらゆるデバイスで最適な表示を実現</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#333] mb-3 flex items-center">
                  <i className="ri-speed-line text-[#3be7ed] mr-2"></i>
                  高速表示
                </h3>
                <p className="text-gray-600 text-sm">画像最適化とキャッシュ機能により、ページ読み込み時間を大幅に短縮</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#333] mb-3 flex items-center">
                  <i className="ri-user-line text-[#3be7ed] mr-2"></i>
                  直感的なUI/UX
                </h3>
                <p className="text-gray-600 text-sm">ユーザーの導線を考慮したインターフェース設計</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#333] mb-3 flex items-center">
                  <i className="ri-shield-check-line text-[#3be7ed] mr-2"></i>
                  セキュリティ対策
                </h3>
                <p className="text-gray-600 text-sm">SSL暗号化とセキュアなデータ処理を実装</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}