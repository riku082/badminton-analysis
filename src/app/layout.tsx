import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BadmintonProvider } from "@/context/BadmintonContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "バドミントン配球解析",
  description: "バドミントンの配球を記録・分析するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <BadmintonProvider>
          {children}
        </BadmintonProvider>
      </body>
    </html>
  );
}
