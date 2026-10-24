import type { Metadata } from "next";
import "./globals.css";

const siteTitle = "N。 | Portfolio";
const siteDescription = "N。（えぬまる）のポートフォリオ。ライティング / フロントエンド / 生成AI 活用";

export const metadata: Metadata = {
  // OGP画像などの相対パスを絶対URLにするための基準
  metadataBase: new URL("https://www.natomi.work"),
  title: siteTitle,
  description: siteDescription,
  // note・X などでリンクを貼ったときのカード表示
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: "N。",
    images: [{ url: "/ogp.png", width: 1200, height: 630, alt: siteTitle }],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
