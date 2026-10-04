// FARM360：サイトの魅力（実物・見どころ）を先に、誰のため・なぜ・技術をあとに
import SiteDetail from '@/components/SiteDetail';

const shot = (n: string) => ({ src: `/works/1/page-${n}.jpg`, w: 1024, h: 798 });

export default function WorkPage1() {
  return (
    <SiteDetail
      title="FARM360"
      tagline="しあわせな牧場の、おいしいものを紹介する牧場訪問サイト"
      href="https://www.farm360.jp"
      hrefLabel="WEBサイトへ"
      pc={{ src: '/works/1/work1.mp4', video: true, w: 1024, h: 798 }}
      phones={[{ src: '/works/1/sp-1.jpg' }, { src: '/works/1/sp-2.jpg' }]}
      highlightTitle="見どころ"
      highlights={[
        { ...shot('story'), label: 'STORY', sub: '思い' },
        { ...shot('products'), label: 'PRODUCTS', sub: 'お取り寄せ' },
        { ...shot('search'), label: 'FARM', sub: '牧場検索' },
        { ...shot('note'), label: 'NOTE', sub: '読みもの' },
        { ...shot('info'), label: 'INFO', sub: '牧場情報' },
      ]}
      blocks={[
        {
          title: 'ターゲット',
          tone: '#d0f0d0',
          lines: [
            '平飼い卵や放牧の商品を見かけて、気になっている消費者',
            '牧場のこだわりや、おいしい理由を知りたい一般の方、学生、食や環境に関心のある層',
          ],
        },
        {
          title: '課題',
          tone: '#f8e8a0',
          lines: ['平飼いや放牧が何なのか、ふつうの商品と何が違うのかを知る機会が少ない', '消費者と生産者の距離が遠く、牧場のこだわりが伝わりにくい'],
        },
        {
          title: '目的',
          tone: '#b8e0f0',
          lines: [
            '牧場のこだわりと「おいしい理由」を伝え、消費者に「食べること」と「環境」への意識を広げること',
            '自分で牧場を訪ねて見たことを伝え、牧場のファンづくりにつなげること',
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
