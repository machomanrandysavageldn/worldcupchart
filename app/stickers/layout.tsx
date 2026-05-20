import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sticker book",
  description:
    "Collect-all sticker book for the 48 nations qualified for the 2026 FIFA World Cup. Foil flips, confetti on collect — saved on your device.",
  alternates: { canonical: "/stickers" },
};

export default function StickersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
