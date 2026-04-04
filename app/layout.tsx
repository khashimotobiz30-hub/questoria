import type { Metadata } from "next";
import { Noto_Sans_JP, Orbitron, Share_Tech_Mono } from "next/font/google";

import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import "./globals.css";

const orbitron = Orbitron({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const shareTechMono = Share_Tech_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-share-tech",
});

const notoSansJp = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "QUESTORIA | AIスキル診断",
  description: "AIを活用して課題を定義し、設計し、判断する思考力を診断する。あなたのAIスキルを、証明せよ。",
  openGraph: {
    title: "QUESTORIA | AIスキル診断",
    description:
      "あなたのAIスキルタイプを診断する。勇者・賢者・預言者・狩人・村人など、あなたはどの型か。",
    url: "https://questoria.app",
    siteName: "QUESTORIA",
    images: [
      {
        url: "https://questoria-liart.vercel.app/og-default.png",
        width: 1200,
        height: 630,
        alt: "QUESTORIA AIスキル診断",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QUESTORIA | AIスキル診断",
    description:
      "あなたのAIスキルタイプを診断する。勇者・賢者・預言者・狩人・村人など、あなたはどの型か。",
    images: ["https://questoria-liart.vercel.app/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${orbitron.variable} ${shareTechMono.variable} ${notoSansJp.variable}`}
    >
      <body className="antialiased">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
