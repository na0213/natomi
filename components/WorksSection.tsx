
'use client';

import Link from 'next/link';

export default function WorksSection() {
  const works = [
    {
      id: 1,
      title: 'テクノロジー業界のトレンド記事',
      description: 'IT企業向けメディアでの最新技術動向に関する記事執筆。SEO対策を意識した構成で、月間PV数向上に貢献。',
      category: 'ライティング',
      thumbnail: 'https://readdy.ai/api/search-image?query=modern%20technology%20articles%20on%20computer%20screen%2C%20clean%20minimalist%20workspace%2C%20bright%20lighting%2C%20professional%20writing%20environment%2C%20blue%20and%20cyan%20color%20scheme%2C%20high%20quality%20digital%20content%20creation&width=400&height=250&seq=work1&orientation=landscape',
      link: '#',
      tags: ['SEO', 'テクノロジー', 'コンテンツマーケティング']
    },
    {
      id: 2,
      title: 'ヘルスケア関連コンテンツ',
      description: '医療・健康分野での専門的な記事執筆。学術的な背景を活かした信頼性の高いコンテンツ制作。',
      category: 'ライティング',
      thumbnail: 'https://readdy.ai/api/search-image?query=healthcare%20medical%20content%20writing%2C%20clean%20white%20background%2C%20professional%20medical%20documents%2C%20turquoise%20highlights%2C%20modern%20flat%20design%2C%20health%20and%20wellness%20theme&width=400&height=250&seq=work2&orientation=landscape',
      link: '#',
      tags: ['医療', '健康', '専門記事']
    },
    {
      id: 3,
      title: 'ビジネス効率化記事シリーズ',
      description: '中小企業向けの業務効率化に関する記事シリーズ。実際の業務経験を基にした実践的な内容。',
      category: 'ライティング',
      thumbnail: 'https://readdy.ai/api/search-image?query=business%20efficiency%20articles%2C%20modern%20office%20environment%2C%20productivity%20tools%2C%20clean%20workspace%2C%20cyan%20and%20blue%20color%20palette%2C%20professional%20business%20content&width=400&height=250&seq=work3&orientation=landscape',
      link: '#',
      tags: ['ビジネス', '効率化', '実践的']
    },
    {
      id: 4,
      title: 'データ分析レポート',
      description: '市場調査データの分析とレポート作成。複雑なデータを分かりやすく可視化したプレゼンテーション資料。',
      category: 'データ分析',
      thumbnail: 'https://readdy.ai/api/search-image?query=data%20analysis%20reports%2C%20charts%20and%20graphs%2C%20modern%20dashboard%20design%2C%20cyan%20color%20scheme%2C%20professional%20business%20analytics%2C%20clean%20white%20background&width=400&height=250&seq=work4&orientation=landscape',
      link: '#',
      tags: ['データ分析', '可視化', 'レポート']
    },
    {
      id: 5,
      title: 'コンテンツマーケティング戦略',
      description: 'スタートアップ企業のコンテンツマーケティング戦略立案とコンテンツ制作。ブランド認知度向上に貢献。',
      category: 'マーケティング',
      thumbnail: 'https://readdy.ai/api/search-image?query=content%20marketing%20strategy%2C%20digital%20marketing%20planning%2C%20modern%20workspace%2C%20turquoise%20accents%2C%20professional%20marketing%20materials%2C%20clean%20design&width=400&height=250&seq=work5&orientation=landscape',
      link: '#',
      tags: ['マーケティング', 'ブランディング', '戦略']
    },
    {
      id: 6,
      title: 'エクセル業務効率化ツール',
      description: 'VBAを使用した業務効率化ツールの開発。繰り返し作業の自動化により、作業時間を大幅に短縮。',
      category: 'Excel・VBA',
      thumbnail: 'https://readdy.ai/api/search-image?query=excel%20automation%20tools%2C%20spreadsheet%20interface%2C%20modern%20office%20software%2C%20cyan%20color%20theme%2C%20professional%20business%20tools%2C%20clean%20interface%20design&width=400&height=250&seq=work6&orientation=landscape',
      link: '#',
      tags: ['Excel', 'VBA', '自動化']
    }
  ];

  return (
    <section id="works" className="py-20 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#333]">Works</h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.id}`}
                className="work-card bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={work.thumbnail}
                    alt={work.title}
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#3be7ed] text-white px-3 py-1 rounded-full text-xs font-medium">
                      {work.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#333] mb-3">{work.title}</h3>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">{work.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {work.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-[#3be7ed] hover:text-[#2dd4da] text-sm font-medium flex items-center whitespace-nowrap">
                      詳細を見る
                      <i className="ri-arrow-right-line ml-1"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
