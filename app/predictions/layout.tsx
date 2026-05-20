import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Predictions",
  description:
    "Family predictions game for the 2026 FIFA World Cup — pick group winners, semi-finalists, finalists, champion and golden boot. Saved on your device.",
  alternates: { canonical: "/predictions" },
};

export default function PredictionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
