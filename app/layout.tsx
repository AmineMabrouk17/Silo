import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Compound Interest & Retirement Income Calculator",
  description:
    "Monthly savings plan to future monthly income, in Tunisian Dinar. A bento-style financial intelligence dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="site-header">
          <div className="brand">
            <div className="brand-mark">S</div>
            <span className="font-semibold tracking-tight text-white flex items-center gap-1.5 text-sm">
              Silo <span className="brand-version">v beta</span>
            </span>
          </div>
          <div className="header-right">
            <span className="header-status">
              <span className="dot"></span>
              Realtime Model
            </span>
            <div className="header-currency">
              <span className="currency-icon">$</span>
              <span>Tunisian Dinar</span>
              <span className="header-currency-symbol">TND</span>
            </div>
          </div>
        </header>

        <div className="page-container">
          {children}
        </div>
      </body>
    </html>
  );
}
