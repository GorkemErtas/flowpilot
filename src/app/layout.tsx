import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "FlowPilot | Operasyonlarınız akışa geçsin",
  description: "KOBİ'ler için yalın ve güvenilir iş otomasyonu danışmanlığı.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
