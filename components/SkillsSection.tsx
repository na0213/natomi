'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import styles from './SkillsSection.module.css';
import { ActorPeek, InkBorder, SkillIcon, type SkillIconId } from './skillArt';
import { COLORS, type ActorId } from './heroActors';

type Tone = 'green' | 'yellow' | 'blue' | 'pink';

// アイコン・のぞく動物・色（トップの住人と、サイトのお花アイコンの色）
const TONES: Record<Tone, { back: string; flower: string }> = {
  green: { back: COLORS.green, flower: '/icons/green.png' },
  yellow: { back: COLORS.yellow, flower: '/icons/yellow.png' },
  blue: { back: COLORS.blue, flower: '/icons/blue.png' },
  pink: { back: COLORS.pink, flower: '/icons/pink.png' },
};

export default function SkillsSection() {
  const headRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const skills: {
    id: string;
    name: string;
    art: SkillIconId;
    actor: ActorId;
    tone: Tone;
    description: string;
  }[] = [
    {
      id: 'frontend',
      name: 'フロントエンド実装',
      art: 'frontend',
      actor: 'cat',
      tone: 'green',
      description: 'HTML/CSS、JavaScript、React / Next.jsによる、見た目と使いやすさを両立したUI実装。',
    },
    {
      id: 'backend',
      name: 'Webアプリ開発',
      art: 'webapp',
      actor: 'dog',
      tone: 'yellow',
      description: 'PHP / Laravel、API連携、フォーム送信、データ処理など、個人開発アプリの土台づくり。',
    },
    {
      id: 'aws',
      name: 'AWS / サーバレス',
      art: 'aws',
      actor: 'whale',
      tone: 'blue',
      description: 'Lambda / CloudFront / Route 53 / API Gateway / S3を用いたサーバレス構成、EC2での簡易構築など。',
    },
    {
      id: 'writing',
      name: '取材・ライティング',
      art: 'writing',
      actor: 'sloth',
      tone: 'yellow',
      description: 'インタビュー記事や広報コンテンツの執筆。伝えるべき魅力を整理し、言葉に。',
    },
    {
      id: 'genai',
      name: '生成AI活用',
      art: 'genai',
      actor: 'penguin',
      tone: 'pink',
      description: '文章・画像・動画制作と、制作フローの効率化への生成AIの導入。生成AIパスポート取得。',
    },
    {
      id: 'visual',
      name: '3D / WebARの学習',
      art: 'ar',
      actor: 'dolphin',
      tone: 'green',
      description: 'Blenderの基礎を学びつつ、Rodinで作ったモデルのWebAR表現を探求中。',
    },
  ];

  // 画面に入ったら、線が引かれはじめる（一度だけ）
  useEffect(() => {
    const els: HTMLElement[] = [];
    if (headRef.current) els.push(headRef.current);
    itemRefs.current.forEach((el) => el && els.push(el));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mark = (el: Element) => el.classList.add(el === headRef.current ? styles.inHead : styles.in);
    if (reduce) {
      els.forEach(mark);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          mark(e.target);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" className="py-20 bg-white scroll-mt-24">
      <div className="container mx-auto px-4">
        <div ref={headRef} className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.22em] text-[#08aeb8]">SKILLS</p>
          <h2 className="text-3xl text-[#243033]">
            <span className={styles.mark}>
              できること
              <svg viewBox="0 0 170 12" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 4 7 C 30 1 60 11 90 5 S 140 8 166 4" pathLength={1} />
              </svg>
            </span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto mt-20">
          <div className="grid grid-cols-1 gap-x-4 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill, i) => {
              const tone = TONES[skill.tone];
              return (
                <div
                  key={skill.id}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={styles.item}
                  style={{ '--i': i, '--pastel': tone.back } as CSSProperties}
                >
                  <div className={styles.peek}>
                    <ActorPeek id={skill.actor} />
                  </div>
                  <div className={styles.back} />
                  <div className={styles.card}>
                    <InkBorder seed={i + 3} />
                    <div className="flex items-center mb-4">
                      <div className={`${styles.icon} mr-4`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={tone.flower} alt="" aria-hidden="true" className={styles.flower} />
                        <SkillIcon id={skill.art} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#243033]">{skill.name}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-[#5d686b] leading-7">{skill.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
