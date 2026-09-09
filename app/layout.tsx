import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Compound Interest & Retirement Income — TND",
  description:
    "Monthly savings plan to future monthly income, in Tunisian Dinar. Rebuilt with the spell.sh docs aesthetic.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="site-header">
          <a className="brand" href="#">
            <span className="brand-mark">S</span>
            Silo
          </a>
          <nav className="header-nav">
            <Link className="header-link active" href="/">
              Calculator
            </Link>
          </nav>
          <div className="header-spacer" />
          <span className="header-tag">Tunisian Dinar (TND)</span>
        </header>

        <div className="chrome">
          <aside className="side-rail">
            <nav>
              <div className="side-cat">Getting Started</div>
              <Link className="side-link active" href="/">
                Calculator
              </Link>
            </nav>
            <nav>
              <div className="side-cat">On this page</div>
              <a className="side-link" href="#params">
                Parameters
              </a>
              <a className="side-link" href="#results">
                Results
              </a>
              <a className="side-link" href="#chart">
                Visualization
              </a>
              <a className="side-link" href="#table">
                Breakdown
              </a>
            </nav>
            <nav>
              <div className="side-cat">About</div>
              <a className="side-link" href="https://github.com/AmineMabrouk17/Silo" target="_blank" rel="noopener noreferrer">
                Source on GitHub
              </a>
              <a className="side-link" href="https://spell.sh/docs/components" target="_blank" rel="noopener noreferrer">
                spell.sh design
              </a>
            </nav>
          </aside>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}