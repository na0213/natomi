'use client';

import { useState } from 'react';

export default function SkillsSection() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skills = [
    {
      id: 'htmlcss',
      name: 'HTML/CSS',
      icon: 'ri-html5-line',
      description: 'レスポンシブデザインやアニメーションを含むUI実装が可能',
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      icon: 'ri-javascript-line',
      description: 'DOM操作や非同期処理を含むクライアントサイド開発が可能',
    },
    {
      id: 'php',
      name: 'PHP（Laravel）',
      icon: 'ri-code-s-slash-line',
      description: 'Laravelを使ったWebアプリケーション開発の実務経験',
    },
    {
      id: 'reactnext',
      name: 'React / Next.js',
      icon: 'ri-reactjs-line',
      description: 'コンポーネント設計やAPI連携を含むフロントエンド開発経験',
    },
    {
      id: 'writing',
      name: 'ライティング',
      icon: 'ri-pencil-line',
      description: 'インタビュー記事や広報コンテンツの執筆に対応',
    },
    {
      id: 'genai',
      name: '生成AI活用（パスポート取得）',
      icon: 'ri-robot-2-line',
      description: '生成AIを活用したWeb制作・文章生成・動画制作が可能',
    },
  ];

  return (
    <section id="skills" className="py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-[#333]">で　き　る　こ　と</h2>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="skill-card bg-white p-6 rounded-lg shadow-md border border-gray-100 cursor-pointer outline-none"
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                onFocus={() => setHoveredSkill(skill.id)}
                onBlur={() => setHoveredSkill(null)}
                tabIndex={0}
                role="button"
                aria-expanded={hoveredSkill === skill.id}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#3be7ed]/10 rounded-lg mr-4">
                    <i className={`${skill.icon} text-xl text-[#3be7ed]`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#333]">{skill.name}</h3>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    hoveredSkill === skill.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-sm text-gray-700 leading-relaxed">{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
