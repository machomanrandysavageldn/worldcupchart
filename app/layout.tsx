import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { BRAND_NAME_TOP, BRAND_NAME_BOTTOM, BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/lib/brand";

export const metadata: Metadata = {
  title: BRAND_TAGLINE,
  description: BRAND_DESCRIPTION,
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/groups", label: "Groups" },
  { href: "/knockout", label: "Knockout stages" },
  { href: "/teams", label: "Teams" },
  { href: "/cities", label: "Host Cities" },
  { href: "/news", label: "News" },
  { href: "/predictions", label: "Predictions" },
  { href: "/stickers", label: "Stickers" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="pitch min-h-screen text-wc-ink">
        <header className="sticky top-0 z-30 bg-wc-cream/95 backdrop-blur border-b-[3px] border-wc-ink">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/fifa/emblem.jpg"
                alt="World Cup 26 emblem"
                width={48}
                height={68}
                priority
                className="rounded-md"
              />
              <span className="font-display text-2xl md:text-3xl leading-none">
                {BRAND_NAME_TOP}<br />
                <span className="text-wc-magenta">{BRAND_NAME_BOTTOM}</span>
              </span>
            </Link>
            <nav className="ml-auto flex flex-wrap gap-1 md:gap-2">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="px-3 py-1.5 rounded-full font-semibold text-sm border-2 border-transparent hover:border-wc-ink hover:bg-wc-gold transition"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t-[3px] border-wc-ink mt-16 bg-wc-deep text-wc-cream">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm flex flex-wrap gap-4 items-center">
            <Image src="/fifa/wordmark.png" alt="FIFA World Cup" width={140} height={20} />
            <span>Family tracker · UK times · Non-commercial</span>
            <span className="ml-auto opacity-70">
              Data: Football-Data.org · BBC/Sky/Guardian RSS · FIFA editorial assets
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
