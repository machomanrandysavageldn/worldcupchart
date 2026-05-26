'use client';
import { useEffect, useState } from 'react';

function utcFallback(iso: string) {
  const d = new Date(iso);
  const hh = d.getUTCHours().toString().padStart(2, '0');
  const mm = d.getUTCMinutes().toString().padStart(2, '0');
  return `${hh}:${mm} UTC`;
}

function utcDateFallback(iso: string) {
  const d = new Date(iso);
  return d.toUTCString().slice(0, 11);
}

export function LocalDate({ iso }: { iso: string }) {
  const [display, setDisplay] = useState(utcDateFallback(iso));

  useEffect(() => {
    const d = new Date(iso);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setDisplay(
      new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: tz }).format(d)
    );
  }, [iso]);

  return <span suppressHydrationWarning>{display}</span>;
}

export function LocalTime({ iso }: { iso: string }) {
  const [display, setDisplay] = useState(utcFallback(iso));

  useEffect(() => {
    const d = new Date(iso);
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: tz }).format(d);
    const abbr = new Intl.DateTimeFormat('en', { timeZoneName: 'short', timeZone: tz })
      .formatToParts(d)
      .find(p => p.type === 'timeZoneName')?.value ?? '';
    setDisplay(`${time} ${abbr}`);
  }, [iso]);

  return <span suppressHydrationWarning>{display}</span>;
}
