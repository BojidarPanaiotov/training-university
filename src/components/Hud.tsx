import { useEffect, useRef, useState } from "react";

export function Corners({ className = "border-accent" }: { className?: string }) {
  const base = `pointer-events-none absolute h-3 w-3 ${className}`;
  return (
    <>
      <span aria-hidden className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span aria-hidden className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span aria-hidden className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span aria-hidden className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

export function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1600, 1);
        setValue(to * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function LiveNumber({ min, max, interval = 900 }: { min: number; max: number; interval?: number }) {
  const [value, setValue] = useState(Math.round((min + max) / 2));
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => Math.min(max, Math.max(min, v + Math.round(Math.random() * 6 - 3))));
    }, interval);
    return () => clearInterval(id);
  }, [min, max, interval]);
  return <span className="tabular-nums">{value}</span>;
}

const beat = "h40 l8 -6 l6 6 h10 l5 10 l7 -58 l7 70 l6 -22 h12 l10 -10 l10 10 h40";
const ecgPath = `M0 60 ${Array.from({ length: 8 }, () => beat).join(" ")}`;

export function Ecg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden className={className}>
      <path d={ecgPath} fill="none" stroke="rgba(212,255,0,0.12)" strokeWidth="2" />
      <path
        d={ecgPath}
        fill="none"
        stroke="#d4ff00"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="220 980"
        className="animate-ecg drop-shadow-[0_0_6px_#d4ff00]"
      />
    </svg>
  );
}
