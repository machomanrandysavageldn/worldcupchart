"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND_NAME_TOP, BRAND_NAME_BOTTOM } from "@/lib/brand";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/groups", label: "Groups" },
  { href: "/knockout", label: "Knockout stages" },
  { href: "/teams", label: "Teams" },
  { href: "/cities", label: "Host Cities" },
  { href: "/news", label: "News" },
  { href: "/predictions", label: "Predictions" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 bg-wc-cream/95 backdrop-blur border-b-[3px] border-wc-ink">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-5 flex items-center gap-3 md:gap-4">
        <Link href="/" className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Image
            src="/fifa/emblem.jpg"
            alt="World Cup 26 emblem"
            width={64}
            height={90}
            priority
            className="rounded-md w-12 h-auto md:w-16"
          />
          <span className="font-display text-2xl md:text-4xl leading-none whitespace-nowrap">
            {BRAND_NAME_TOP}{" "}
            <span className="text-wc-magenta">{BRAND_NAME_BOTTOM}</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-auto hidden lg:flex flex-wrap gap-2 justify-end">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-4 py-2 rounded-full font-bold text-base border-2 transition ${
                pathname === n.href
                  ? "border-wc-ink bg-wc-gold"
                  : "border-transparent hover:border-wc-ink hover:bg-wc-gold"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen((x) => !x)}
          className="ml-auto lg:hidden chunky-btn bg-wc-ink text-wc-cream px-3 py-2 font-bold text-sm flex items-center gap-2"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span aria-hidden>{open ? "✕" : "☰"}</span>
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav className="lg:hidden border-t-2 border-wc-ink bg-wc-cream">
          <ul className="mx-auto max-w-7xl px-4 py-3 grid grid-cols-2 gap-2">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`block px-3 py-2 rounded-lg font-bold text-sm border-2 ${
                    pathname === n.href
                      ? "border-wc-ink bg-wc-gold"
                      : "border-wc-ink/20 bg-white hover:bg-wc-gold"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
