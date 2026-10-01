// ポートフォリオ：サイトの魅力（実物・見どころ）を先に、誰のため・なぜ・技術をあとに
import SiteDetail from '@/components/SiteDetail';

const shot = (n: string) => ({ src: `/works/portfolio/page-${n}.jpg`, w: 1100, h: 798 });

export default function WorkPage3() {
  return (
    <SiteDetail
      title="ポートフォリオ"
      tagline="ポートフォリオサイト"
      href="https://www.natomi.work/"
      hrefLabel="WEBサイトへ"
      pc={{ src: '/works/portfolio/site-pc.mp4', video: true, w: 1100, h: 798 }}
      phones={[{ src: '/works/portfolio/site-sp.mp4', video: true }]}
      highlightTitle="見どころ"
      highlights={[
        { ...shot('hero'), label: 'わくわくすること', sub: 'コツコツと' },
        { ...shot('about'), label: 'ABOUT', sub: 'わたしのこと' },
        { ...shot('timeline'), label: 'しごと / かつどう' },
        { ...shot('skills'), label: 'SKILLS', sub: 'できること' },
        { ...shot('works'), label: 'WORKS', sub: 'つくったもの' },
      ]}
      blocks={[
        {
          title: 'ターゲット',
          tone: '#d0f0d0',
          lines: ['自身の活動やスキルを伝えるポートフォリオとして設計。クライアントに直感的に内容が伝わるUIを重視。'],
        },
        {
          title: '課題',
          tone: '#f8e8a0',
          lines: ['情報量が多くなると閲覧者が迷子になりやすい。カテゴリー分けと視覚的な導線が必要。'],
        },
        {
          title: '目的',
          tone: '#b8e0f0',
          lines: [
            '制作物や経歴を整理して見せることで、自分のスキルセットを効果的にアピールする。',
            'レスポンシブ対応で、PC/スマホどちらでも快適に閲覧できるよう設計。',
          ],
        },
      ]}
      craft={{
        title: 'デザイン・実装上の工夫',
        tone: '#f8c8c0',
        lines: [
          'トップは、手描きの線で世界が描かれ、ドット絵のフェレットと動物たちが落ちて弾みます。',
          '年表は、スクロールに合わせて一本の線が引かれ、フェレットが先頭を進みます。',
          'ドット絵やお花のアイコンの雰囲気にそろえて、茶色の線とパステルの色でまとめました。',
          '再利用可能なUI片をコンポーネント化し、スケールしても保守しやすい構造に。',
        ],
      }}
      tech={{ title: '使用言語 / 技術', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Canvas', 'SVG', 'Vercel'] }}
    />
  );
}
