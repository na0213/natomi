'use client';

import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './SiteDetail.module.css';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

/** サイト作品の詳細ページ：実物と見どころを先に見せ、そのあとに「誰のため・なぜ」と技術を置く */

export type SiteHighlight = { src: string; label: string; sub?: string; w: number; h: number };
export type SiteBlock = { title: string; lines: string[]; tone: string };
export type SitePhone = { src: string; video?: boolean };

export type SiteDetailProps = {
  title: string;
  tagline: string;
  href: string;
  hrefLabel: string;
  pc: { src: string; video?: boolean; w: number; h: number };
  phones: SitePhone[];
  highlights: SiteHighlight[];
  highlightTitle: string;
  blocks: SiteBlock[];
  craft: { title: string; lines: string[]; tone: string };
  tech: { title: string; items: string[] };
};

function Browser({ src, video, w, h, alt, pastel }: { src: string; video?: boolean; w: number; h: number; alt: string; pastel?: string }) {
  return (
    <div className={styles.browser} style={pastel ? ({ '--pastel': pastel } as CSSProperties) : undefined}>
      <div className={styles.bar} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      {video ? (
        <video src={src} autoPlay loop muted playsInline preload="metadata" className={styles.shot} style={{ aspectRatio: `${w} / ${h}` }} />
      ) : (
        <Image src={src} alt={alt} width={w} height={h} className={styles.shot} />
      )}
    </div>
  );
}

export default function SiteDetail(p: SiteDetailProps) {
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
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const [first, ...rest] = p.highlights;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header activeSection="works" onNavigate={handleNavigate} />

      <main className="flex-grow pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* ===== ひとこと ===== */}
            <div className="mb-12">
              <button onClick={() => router.push('/#works')} className="mb-4 block">
                <Image src="/icons/arrow.png" alt="戻る" width={52} height={52} className="cursor-pointer wiggleIcon" />
              </button>
              <h1 className="text-3xl text-[#333] mb-2">{p.title}</h1>
              <p className="text-gray-600 mb-3">{p.tagline}</p>
              <Link
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#3be7ed] hover:text-[#2dd4da] underline underline-offset-4"
              >
                {p.hrefLabel}
                <i className="ri-external-link-line text-sm" />
              </Link>
            </div>

            {/* ===== 実物（PCとスマホ） ===== */}
            <div className="mb-28">
              <div className={styles.stage}>
                <div className={styles.pc}>
                  <Browser src={p.pc.src} video={p.pc.video} w={p.pc.w} h={p.pc.h} alt={`${p.title} のPC表示`} pastel="#f8e8a0" />
                </div>
                <div className={styles.phones}>
                  {p.phones.map((ph, i) => (
                    <div key={ph.src} className={styles.phone} style={{ '--pastel': i ? '#d0f0d0' : '#b8e0f0' } as CSSProperties}>
                      {ph.video ? (
                        <video src={ph.src} autoPlay loop muted playsInline preload="metadata" />
                      ) : (
                        <Image src={ph.src} alt={`${p.title} のスマホ表示`} width={480} height={1040} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== 見どころ ===== */}
            <section className="mb-28">
              <div className={`${styles.reveal} mx-auto mb-12 max-w-3xl text-center`} data-reveal>
                <p className={styles.eyebrow}>{p.highlightTitle}</p>
              </div>
              <div className={styles.grid}>
                {[first, ...rest].map((h, i) => (
                  <div key={h.src} className={`${i === 0 ? styles.wide : ''} ${styles.reveal}`} data-reveal>
                    <div className={styles.label}>
                      <b>{h.label}</b>
                      {h.sub && <span>{h.sub}</span>}
                    </div>
                    <Browser src={h.src} w={h.w} h={h.h} alt={`${p.title} の${h.label}`} pastel={['#f8e8a0', '#d0f0d0', '#b8e0f0', '#f8c8c0', '#f8e8a0'][i % 5]} />
                  </div>
                ))}
              </div>
            </section>

            {/* ===== 誰のため・なぜ ===== */}
            <section className="mb-12">
              <div className={styles.cards}>
                {p.blocks.map((b, i) => (
                  <div key={b.title} className={`${styles.card} ${styles.reveal}`} style={{ '--pastel': b.tone, transitionDelay: `${i * 0.08}s` } as CSSProperties} data-reveal>
                    <h3>{b.title}</h3>
                    {b.lines.map((l) => (
                      <p key={l}>{l.trim()}</p>
                    ))}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <div className={`${styles.card} ${styles.reveal}`} style={{ '--pastel': p.craft.tone } as CSSProperties} data-reveal>
                <h3>{p.craft.title}</h3>
                {p.craft.lines.map((l) => (
                  <p key={l}>{l.trim()}</p>
                ))}
              </div>
            </section>

            {/* ===== 技術（最後に小さく） ===== */}
            <section className={`${styles.reveal} mb-16`} data-reveal>
              <h3 className="mb-3 text-sm font-bold text-[#243033]">{p.tech.title}</h3>
              <div className="flex flex-wrap gap-2">
                {p.tech.items.map((t) => (
                  <span key={t} className={styles.chip}>
                    {t}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
