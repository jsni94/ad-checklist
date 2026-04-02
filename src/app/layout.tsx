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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
