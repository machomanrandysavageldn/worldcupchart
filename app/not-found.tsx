import Link from "next/link";
import { Mascot } from "@/components/Mascot";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <div className="flex justify-center"><Mascot size={120} /></div>
      <div className="font-display text-6xl mt-4">Off the pitch</div>
      <p className="mt-2 text-lg">That page is in the changing room.</p>
      <Link href="/" className="chunky-btn inline-block mt-6 bg-wc-magenta text-white px-5 py-2 font-bold">
        Back to home
      </Link>
    </div>
  );
}
