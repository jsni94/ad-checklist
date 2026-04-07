import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ad Checklist - 광고 준비 체크리스트",
  description:
    "페이스북/인스타 광고를 돌리기 전에 빠뜨린 거 없나 확인하는 체크리스트 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* Pretendard — 한글 최적화 가변 폰트 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-[#FAFAF9]">{children}</body>
    </html>
  );
}
