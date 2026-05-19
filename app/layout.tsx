import type { Metadata, Viewport } from "next";
import "./globals.css";
import Image from "next/image";
import { BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/lib/brand";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: BRAND_TAGLINE,
  description: BRAND_DESCRIPTION,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF6E5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="pitch min-h-screen text-wc-ink">
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t-[3px] border-wc-ink mt-16 bg-wc-deep text-wc-cream">
          <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 text-xs md:text-sm flex flex-wrap gap-3 md:gap-4 items-center">
            <Image src="/fifa/wordmark.png" alt="FIFA World Cup" width={120} height={18} className="h-4 md:h-5 w-auto" />
            <span>World Cup Watch · Family · UK times · Non-commercial</span>
            <span className="md:ml-auto opacity-70">
              Data: Football-Data.org · BBC/Sky/Guardian RSS · FIFA editorial assets
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
