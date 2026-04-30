export function BroadcasterBadge({ broadcaster }: { broadcaster: "BBC" | "ITV" | "Sky" | "TBC" }) {
  const styles: Record<string, string> = {
    BBC: "bg-wc-ink text-wc-cream",
    ITV: "bg-wc-magenta text-white",
    Sky: "bg-wc-cobalt text-white",
    TBC: "bg-wc-cream text-wc-ink",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-wc-ink ${styles[broadcaster]}`}>
      {broadcaster}
    </span>
  );
}
