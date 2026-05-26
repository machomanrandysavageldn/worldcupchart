import type { Metadata, Viewport } from "next";
import "./globals.css";
import Image from "next/image";
import { BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/lib/brand";
import { SiteHeader } from "@/components/SiteHeader";

const SITE_URL = "https://worldcupwatch.lol";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_TAGLINE} · 2026 World Cup fixtures, news & predictions (UK)`,
    template: `%s · ${BRAND_TAGLINE}`,
  },
  description: BRAND_DESCRIPTION,
  applicationName: BRAND_TAGLINE,
  keywords: [
    "World Cup 2026",
    "FIFA World Cup",
    "World Cup fixtures",
    "World Cup UK time",
    "BBC ITV World Cup",
    "World Cup predictions",
    "World Cup groups",
    "World Cup knockout",
    "Canada Mexico USA",
    "family friendly",
  ],
  authors: [{ name: "World Cup Watch" }],
  category: "sports",
  alternates: {
    canonical: "/",
    languages: { "en-GB": "/" },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: BRAND_TAGLINE,
    title: `${BRAND_TAGLINE} · 2026 World Cup fixtures, news & predictions (UK)`,
    description: BRAND_DESCRIPTION,
    images: [
      {
        url: "/fifa/host-cities-grid.jpg",
        width: 1600,
        height: 800,
        alt: "FIFA World Cup 2026 host cities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_TAGLINE} · 2026 World Cup (UK)`,
    description: BRAND_DESCRIPTION,
    images: ["/fifa/host-cities-grid.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: {
    // GEO targeting hints — UK family audience.
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "distribution": "global",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFF6E5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: BRAND_TAGLINE,
        url: SITE_URL,
        inLanguage: "en-GB",
        description: BRAND_DESCRIPTION,
        publisher: { "@type": "Organization", name: BRAND_TAGLINE },
      },
      {
        "@type": "SportsEvent",
        name: "FIFA World Cup 2026",
        startDate: "2026-06-11",
        endDate: "2026-07-19",
        eventStatus: "https://schema.org/EventScheduled",
        location: [
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "Mexico" },
          { "@type": "Country", name: "United States" },
        ],
        sport: "Association football",
        organizer: { "@type": "Organization", name: "FIFA" },
        url: SITE_URL,
      },
    ],
  };
  return (
    <html lang="en-GB">
      <body className="pitch min-h-screen text-wc-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t-[3px] border-wc-ink mt-16 bg-wc-deep text-wc-cream">
          <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 text-xs md:text-sm flex flex-wrap gap-3 md:gap-4 items-center">
            <Image src="/fifa/wordmark.png" alt="FIFA World Cup" width={120} height={18} className="h-4 md:h-5 w-auto" />
            <span>World Cup Watch · Family · UK times · Non-commercial</span>
            <span>Made just for fun by football lovers. Got questions? <a href="mailto:worldcupwatch@holdtight.cc" className="underline hover:text-wc-gold">worldcupwatch@holdtight.cc</a></span>
            <span className="md:ml-auto opacity-70">
              Data: Football-Data.org · BBC/Sky/Guardian RSS · FIFA editorial assets
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
