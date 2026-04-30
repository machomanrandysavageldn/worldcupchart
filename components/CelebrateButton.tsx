"use client";
import { useState } from "react";
import { Confetti } from "./Confetti";

export function CelebrateButton() {
  const [n, setN] = useState(0);
  return (
    <>
      <Confetti trigger={n} />
      <button
        onClick={() => setN((x) => x + 1)}
        className="chunky-btn bg-wc-magenta text-white px-4 py-2 font-bold w-full"
      >
        🎉 Celebrate a goal
      </button>
    </>
  );
}
