'use client';

import { useState } from 'react';

export default function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skills = [
    {
      id: 'frontend',
      name: 'フロントエンド実装',
      icon: 'ri-layout-4-line',
      description: 'HTML/CSS、JavaScript、React / Next.jsで、見た目と使いやすさを両立したUIを実装します。',
    },
    {
      id: 'backend',
      name: 'Webアプリ開発',
      icon: 'ri-code-s-slash-line',
      description: 'PHP / Laravel、API連携、フォーム送信、データ処理など、個人開発アプリに必要な土台を組み立てます。',
    },
    {
      id: 'aws',
      name: 'AWS / サーバレス',
      icon: 'ri-cloud-line',
      description: 'Lambda / CloudFront / Route 53 / API Gateway / S3を用いたサーバレス構成、EC2での簡易構築に対応します。',
    },
    {
      id: 'writing',
      name: '取材・ライティング',
      icon: 'ri-pencil-line',
      description: 'インタビュー記事や広報コンテンツの執筆経験を活かし、伝えるべき魅力を整理して言葉にします。',
    },
    {
      id: 'genai',
      name: '生成AI活用',
      icon: 'ri-robot-2-line',
      description: '文章生成、画像制作、動画制作、制作フローの効率化に生成AIを取り入れます。生成AIパスポート取得。',
    },
    {
      id: 'visual',
      name: '3D / WebARの学習',
      icon: 'ri-blender-line',
      description: 'Blenderの基礎を学びながら、8th WallやRodinと組み合わせたWebAR表現を探っています。',
    },
  ];

  return (
    <section id="skills" className="py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#08aeb8]">SKILLS</p>
          <h2 className="text-3xl text-[#243033]">できること</h2>
          <p className="mt-4 text-sm leading-7 text-[#5e6a6d]">
            書く、聞く、設計する、実装する。個人開発アプリを育てていくための力を、制作物として積み重ねています。
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="skill-card min-h-[176px] bg-white p-5 shadow-sm ring-1 ring-[#e1eded] transition hover:-translate-y-1 hover:shadow-md cursor-pointer outline-none"
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                onFocus={() => setHoveredSkill(skill.id)}
                onBlur={() => setHoveredSkill(null)}
                tabIndex={0}
                role="button"
                aria-expanded={hoveredSkill === skill.id}
              >
                <div className="flex items-center mb-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#e6fafa] mr-4">
                    <i className={`${skill.icon} text-xl text-[#08aeb8]`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#243033]">{skill.name}</h3>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    hoveredSkill === skill.id ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-[#5d686b] leading-7">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
