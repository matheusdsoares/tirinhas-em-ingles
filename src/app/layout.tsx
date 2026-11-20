import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Tirinhas em Inglês",
  description: "Aprenda inglês com diálogos curtos, palavras recorrentes e pronúncia."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={nunito.variable}>{children}</body>
    </html>
  );
}
