import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { ZenMotionInit } from "@/components/ZenMotionInit";
import { SITE_NAME, positioning } from "@seedchlogy/shared";
import "./globals.css";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${SITE_NAME} — calm breathing & gentle guidance`,
  description: positioning.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[var(--color-stone)]">
        <ZenMotionInit />
        {children}
      </body>
    </html>
  );
}
