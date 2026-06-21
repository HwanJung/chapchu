import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "세대번역소",
  description: "말뜻과 마음 사이, 세대와 상황에 맞는 한국어 표현을 제안합니다.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
