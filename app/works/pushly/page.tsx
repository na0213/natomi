'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import styles from './page.module.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

/* 文言は、公開中の Pushly 公式ページ（www.pushly-app.info）の言葉をそのまま使っています */

const APP_STORE = 'https://apps.apple.com/jp/app/pushly/id6774212432';

const QUOTES = [
  { text: '予約日、過ぎてた', tone: '#f8c8c0' },
  { text: 'サブスク、更新されてた', tone: '#b8e0f0' },
  { text: '健康診断、いつ行ったっけ？', tone: '#d0f0d0' },
  { text: '免許更新、もうすぐ？', tone: '#f8e8a0' },
  { text: '予防接種、次いつだっけ？', tone: '#f8c8c0' },
  { text: 'パスポート、期限大丈夫？', tone: '#b8e0f0' },
];

type Feature = {
  n: string;
  title: string[];
  body: string;
  chips: string[];
  tone: string;
  image: string;
};

const FEATURES: Feature[] = [
  {
    n: '01',
    title: ['カテゴリー別に', '予定を整理'],
    body: '仕事・健康・お金・手続きなど、自分の暮らしに合わせて分類。ひと目で、何を覚えていてほしいかが分かる。',
    chips: ['仕事', '健康', 'お金', '手続き', '+ カスタム'],
    tone: '#d0f0d0',
    image: '/works/pushly/screen-category.jpg',
  },
  {
    n: '02',
    title: ['通知のタイミングを', '自由に設定'],
    body: '1ヶ月前、1週間前、当日など、複数の通知をまとめて設定可能。「気づいた時には遅かった」をなくす、余裕のあるお知らせ。',
    chips: ['当日', '1日前', '1週間前', '1ヶ月前', 'カスタム'],
    tone: '#f8e8a0',
    image: '/works/pushly/screen-detail.jpg',
  },
  {
    n: '03',
    title: ['終わった予定も', '次につながる'],
    body: '完了した予定は記録として残り、希望すれば「前回から○ヶ月」と経過通知も設定できる。前回いつだったか迷わない。',
    chips: ['完了記録', '経過通知', '前回から○ヶ月'],
    tone: '#b8e0f0',
    image: '/works/pushly/screen-history.jpg',
  },
];

const FOR_YOU = ['大事な予定をよく忘れてしまう', '毎日アプリを開くのは続かない', '必要なときだけ教えてほしい'];
const FOR_YOU_TONES = ['#f8c8c0', '#b8e0f0', '#d0f0d0'];

const SAFE = [
  { title: '端末のみ保存', body: 'データは端末に保存。Zipバックアップから復元できます。', tone: '#d0f0d0' },
  { title: '登録不要', body: 'アカウント作成なしで、すぐに使えます。', tone: '#f8e8a0' },
  { title: '広告なし', body: '広告もトラッキングも一切ありません。', tone: '#b8e0f0' },
];

function StoreLink({ className = '' }: { className?: string }) {
  return (
    <a href={APP_STORE} target="_blank" rel="noopener noreferrer" className={`inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/works/pushly/app-store-badge-ja.svg" alt="Download on the App Store" width={162} height={60} className="h-[52px] w-auto" />
    </a>
  );
}

export default function PushlyPage() {
  const router = useRouter();
  const handleNavigate = (sectionId: string) => router.push(`/#${sectionId}`);

  // スクロールで、ふわっと現れる
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add(styles.in));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add(styles.in);
          io.unobserve(e.target);
        }),
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header activeSection="works" onNavigate={handleNavigate} />

      <main className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* ===== ヒーロー ===== */}
            <section className="mb-24 grid items-center gap-10 md:grid-cols-2">
              <div>
                <button onClick={() => router.push('/#works')} className="mb-6 block">
                  <Image src="/icons/arrow.png" alt="戻る" width={52} height={52} className="cursor-pointer wiggleIcon" />
                </button>
                <div className="mb-5 flex items-center gap-4">
                  <Image
                    src="/works/pushly/app-icon.png"
                    alt="Pushly のアプリアイコン"
                    width={72}
                    height={72}
                    className="rounded-[18px] border-2 border-[#685040] shadow-[4px_5px_0_#f8e8a0]"
                  />
                  <div>
                    <p className={styles.eyebrow}>iPhoneアプリ</p>
                    <h1 className="text-3xl text-[#243033]">Pushly</h1>
                  </div>
                </div>
                <p className="mb-4 text-2xl leading-relaxed text-[#243033]">
                  忘れたくないこと
                  <br />
                  ぜんぶ預けて
                </p>
                <p className="mb-1 text-gray-600">&quot;うっかり過ぎてた&quot; を、もう繰り返さない</p>
                <p className="mb-6 text-gray-600">予約、サブスク、健診、更新日 忘れがちな予定のためのリマインダー</p>
                <StoreLink />
              </div>

              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/yellow.png" alt="" aria-hidden="true" className={styles.flower} style={{ left: '-10px', top: '-18px' }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/blue.png" alt="" aria-hidden="true" className={styles.flower} style={{ right: '-6px', bottom: '-10px' }} />
                <div className={styles.fan}>
                  <div className={`${styles.phone} ${styles.left}`}>
                    <Image src="/works/pushly/screen-category.jpg" alt="Pushly のカテゴリ管理の画面" width={640} height={1387} priority />
                  </div>
                  <div className={`${styles.phone} ${styles.right}`}>
                    <Image src="/works/pushly/screen-detail.jpg" alt="Pushly の通知タイミングの画面" width={640} height={1387} priority />
                  </div>
                  <div className={`${styles.phone} ${styles.center}`}>
                    <Image src="/works/pushly/screen-home.jpg" alt="Pushly の予定の画面" width={640} height={1387} priority />
                  </div>
                </div>
              </div>
            </section>

            {/* ===== あるある ===== */}
            <section className="mb-24">
              <div className={`${styles.reveal} mx-auto mb-10 max-w-3xl text-center`} data-reveal>
                <h2 className="mb-3 text-2xl text-[#243033] md:text-3xl">あ、過ぎてた を、なくしたい</h2>
                <p className="text-gray-600">忘れがちな予定は、いつのまにか過ぎていく</p>
              </div>
              <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {QUOTES.map((q, i) => (
                  <div
                    key={q.text}
                    className={`${styles.quote} ${styles.reveal}`}
                    style={{ '--pastel': q.tone, transitionDelay: `${(i % 3) * 0.08}s` } as CSSProperties}
                    data-reveal
                  >
                    <p className="text-lg text-[#243033]">{q.text}</p>
                  </div>
                ))}
              </div>
              <p className={`${styles.reveal} mt-10 text-center text-lg text-[#243033]`} data-reveal>
                そんな<span className="mx-1 bg-[#f8e8a0] px-1">うっかり</span>を、Pushlyが覚えておきます。
              </p>
            </section>

            {/* ===== もうひとつの選択肢 ===== */}
            <section className={`${styles.reveal} mx-auto mb-28 max-w-3xl text-center`} data-reveal>
              <h2 className="mb-4 text-2xl leading-relaxed text-[#243033] md:text-3xl">
                TODOでもタスク管理でもない
                <br />
                もうひとつの選択肢
              </h2>
              <p className="mb-4 text-gray-600">毎日確認するアプリじゃない。でも、忘れたら困るもののために。</p>
              <p className="mb-2 leading-8 text-[#243033]">Pushlyは、忘れがちな予定 専用。毎日開かなくても、必要なときに通知が届く。</p>
              <p className="leading-8 text-[#243033]">TODOでもカレンダーでもカバーしきれない予定のために。</p>
            </section>

            {/* ===== できること ===== */}
            <section className="mb-28">
              <div className="mx-auto mb-14 max-w-3xl text-center">
                <h2 className="mb-3 text-2xl text-[#243033] md:text-3xl">Pushlyで、できること</h2>
                <p className="text-gray-600">三つのシンプルな機能で、暮らしの「うっかり」をぜんぶ預けられる。</p>
              </div>

              <div className="space-y-24">
                {FEATURES.map((f, i) => (
                  <div key={f.n} className={`${styles.feature} ${i % 2 ? styles.flip : ''}`} style={{ '--pastel': f.tone } as CSSProperties}>
                    <div className={`${styles.text} ${styles.reveal}`} data-reveal>
                      <p className={`${styles.num} mb-3`}>{f.n}</p>
                      <h3 className="mb-4 text-xl leading-relaxed text-[#243033] md:text-2xl">
                        {f.title[0]}
                        <br />
                        {f.title[1]}
                      </h3>
                      <p className="mb-5 leading-8 text-gray-600">{f.body}</p>
                      <div className="flex flex-wrap gap-2">
                        {f.chips.map((c) => (
                          <span key={c} className={styles.chip}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={`${styles.visual} ${styles.reveal}`} data-reveal>
                      <div className={styles.phone}>
                        <Image src={f.image} alt={f.title.join('')} width={640} height={1387} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== つくった理由 ===== */}
            <section className={`${styles.reveal} mx-auto mb-28 max-w-3xl`} data-reveal>
              <div className={styles.reason}>
                <h2 className="mb-4 text-xl text-[#243033] md:text-2xl">つくった理由</h2>
                <p className="leading-9 text-[#243033]">
                  私自身が健康診断など、一年前、数年前にいつ行ったっけ？次回はいつ頃行けばいいんだっけ？といった、日付が未定だけど○ヶ月後、という予定をカレンダーから探すことに苦労したからです。
                </p>
              </div>
            </section>

            {/* ===== こんな人に ===== */}
            <section className="mb-24">
              <div className={`${styles.reveal} mx-auto mb-10 max-w-3xl text-center`} data-reveal>
                <h2 className="mb-3 text-2xl text-[#243033] md:text-3xl">こんな人に、おすすめ</h2>
                <p className="text-gray-600">ひとつでも当てはまったら、Pushlyを試してほしい</p>
              </div>
              <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
                {FOR_YOU.map((t, i) => (
                  <div
                    key={t}
                    className={`${styles.check} ${styles.reveal}`}
                    style={{ '--pastel': FOR_YOU_TONES[i], transitionDelay: `${i * 0.08}s` } as CSSProperties}
                    data-reveal
                  >
                    <span className={styles.tick} aria-hidden="true" />
                    <p className="text-[#243033]">{t}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== 安心 ===== */}
            <section className="mb-24">
              <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
                {SAFE.map((s, i) => (
                  <div
                    key={s.title}
                    className={`${styles.quote} ${styles.reveal}`}
                    style={{ '--pastel': s.tone, transitionDelay: `${i * 0.08}s` } as CSSProperties}
                    data-reveal
                  >
                    <h3 className="mb-2 text-base font-bold text-[#243033]">{s.title}</h3>
                    <p className="text-sm leading-7 text-gray-600">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ===== むすび ===== */}
            <section className={`${styles.reveal} mx-auto mb-16 max-w-3xl text-center`} data-reveal>
              <h2 className="mb-4 text-2xl leading-relaxed text-[#243033] md:text-3xl">
                「覚えておかなきゃ」から
                <br />
                解放されよう
              </h2>
              <p className="mb-6 text-gray-600">Pushlyを、今日から 登録不要、シンプルに</p>
              <StoreLink />
            </section>
          </div>
        </div>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
