import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "natomi | Portfolio",
  description: "natomiのポートフォリオ。ライティング / フロントエンド / 生成AI 活用",
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
