"use client";

export const STICKER_KEY = "wct.stickers.v1";

export interface StickerState {
  collected: Record<string, number>; // teamCode -> timestamp ms
}

export function loadStickers(): StickerState {
  if (typeof window === "undefined") return { collected: {} };
  try {
    const raw = localStorage.getItem(STICKER_KEY);
    if (!raw) return { collected: {} };
    return JSON.parse(raw);
  } catch {
    return { collected: {} };
  }
}

export function saveStickers(s: StickerState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STICKER_KEY, JSON.stringify(s));
}
