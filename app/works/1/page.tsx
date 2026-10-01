// ウェルフェアFARM：サイトの魅力（実物・見どころ）を先に、誰のため・なぜ・技術をあとに
import SiteDetail from '@/components/SiteDetail';

const shot = (n: string) => ({ src: `/works/1/page-${n}.jpg`, w: 1024, h: 798 });

export default function WorkPage1() {
  return (
    <SiteDetail
      title="ウェルフェアFARM"
      tagline="アニマルウェルフェアを中心とした牧場訪問サイト"
      href="https://www.farm360.jp"
      hrefLabel="WEBサイトへ"
      pc={{ src: '/works/1/work1.mp4', video: true, w: 1024, h: 798 }}
      phones={[{ src: '/works/1/sp-1.jpg' }, { src: '/works/1/sp-2.jpg' }]}
      highlightTitle="見どころ"
      highlights={[
        { ...shot('story'), label: 'STORY', sub: '思い' },
        { ...shot('farm'), label: 'FARM', sub: '牧場検索' },
        { ...shot('note'), label: 'NOTE', sub: '訪問記・取材' },
        { ...shot('search'), label: '牧場検索' },
        { ...shot('info'), label: 'INFO', sub: '牧場情報' },
      ]}
      blocks={[
        {
          title: 'ターゲット',
          tone: '#d0f0d0',
          lines: [
            'アニマルウェルフェアや環境配慮に関心のある消費者',
            '牧場の取り組みを知りたい一般の方、学生、食や環境に関心のある層',
          ],
        },
        {
          title: '課題',
          tone: '#f8e8a0',
          lines: ['日常で口にする畜産物の背景や飼育環境を知る機会が少ない', '消費者と生産者の距離が遠く、取り組みが伝わりにくい'],
        },
        {
          title: '目的',
          tone: '#b8e0f0',
          lines: [
            '命の育ち方や飼育の大切さを伝え、消費者に「食べること」と「環境」への意識を広げること',
            '牧場のアニマルウェルフェアの取り組みを可視化し、共感を生むこと',
          ],
        },
      ]}
      craft={{
        title: 'プロセス（デザイン上の工夫）',
        tone: '#f8c8c0',
        lines: [
          '写真や文章をシンプルに配置し、牧場の雰囲気が伝わる柔らかいデザインを心がけました',
          '色味や余白を大切にし、落ち着いたトーンで安心感を演出しています',
        ],
      }}
      tech={{ title: '使用言語 / 技術', items: ['PHP（Laravel）', 'HTML', 'CSS', 'JavaScript', 'AWS S3（画像ストレージ）'] }}
    />
  );
}
