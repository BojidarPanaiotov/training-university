import { useEffect, useRef, useState } from "react";
import { Flame, Heart } from "lucide-react";
import { Corners } from "./Hud";
import athleteCopy from "../locales/bg/athlete.json";
import ui from "../locales/bg/ui.json";

type Pt = [number, number];
type Limb = [number, number];

/** Angles are in degrees: 0 points right, 90 points down, -90 points up. */
interface Pose {
  hip: Pt;
  torso: number;
  head: number;
  arm1: Limb;
  arm2: Limb;
  leg1: Limb;
  leg2: Limb;
}

interface Exercise {
  name: string;
  benefit: string;
  bpm: number;
  poses: Pose[];
  /** Milliseconds to move from one pose to the next, then to hold it. */
  move: number;
  hold: number;
  reps: number;
  smooth: boolean;
  /** Lifts the body off the ground mid-move (jumping). */
  hop?: number;
  /** Scrolls the ground so the athlete appears to travel. */
  travel?: boolean;
  /** Hands and feet that stay planted on the ground. */
  pins?: { arm1: Pt; arm2: Pt; leg1: Pt; leg2: Pt };
}

const TORSO = 42;
const UPPER_ARM = 21;
const FOREARM = 20;
const THIGH = 27;
const SHIN = 27;
const NECK = 15;
const HEAD_RADIUS = 8.5;
const FADE_MS = 220;

const pose = (hip: Pt, torso: number, head: number, arm1: Limb, arm2: Limb, leg1: Limb, leg2: Limb): Pose => ({
  hip,
  torso,
  head,
  arm1,
  arm2,
  leg1,
  leg2,
});

const exerciseMotion: Omit<Exercise, "name" | "benefit">[] = [
  {
    bpm: 138,
    move: 620,
    hold: 90,
    reps: 3,
    smooth: true,
    pins: { arm1: [127, 170], arm2: [131, 170], leg1: [41.5, 168.3], leg2: [44, 168.3] },
    poses: [
      pose([92.1, 146.1], -24, -12, [90, 90], [90, 90], [156, 156], [156, 156]),
      pose([96.3, 160.7], -7.8, -4, [90, 90], [90, 90], [172, 172], [172, 172]),
    ],
  },
  {
    bpm: 74,
    move: 1500,
    hold: 700,
    reps: 1,
    smooth: true,
    poses: [
      pose([100, 116], -90, -90, [150, 365], [390, 175], [90, 90], [35, 162]),
      pose([100, 116], -90, -90, [250, 285], [290, 255], [90, 90], [35, 162]),
    ],
  },
  {
    bpm: 156,
    move: 170,
    hold: 0,
    reps: 6,
    smooth: false,
    travel: true,
    poses: [
      pose([97, 112], -80, -75, [125, 35], [60, -30], [35, 110], [118, 160]),
      pose([97, 116.5], -80, -75, [95, 5], [88, 0], [85, 95], [70, 150]),
      pose([97, 112], -80, -75, [60, -30], [125, 35], [118, 160], [35, 110]),
      pose([97, 116.5], -80, -75, [88, 0], [95, 5], [70, 150], [85, 95]),
    ],
  },
  {
    bpm: 168,
    move: 300,
    hold: 30,
    reps: 6,
    smooth: true,
    hop: 10,
    poses: [
      pose([100, 116], -90, -90, [100, 95], [80, 85], [93, 92], [87, 88]),
      pose([100, 119.3], -90, -90, [240, 250], [-60, -70], [112, 108], [68, 72]),
    ],
  },
  {
    bpm: 88,
    move: 1300,
    hold: 500,
    reps: 1,
    smooth: true,
    poses: [
      pose([100, 117], -68, -58, [-75, -35], [80, 100], [100, 96], [80, 84]),
      pose([100, 117], -112, -122, [-260, -280], [-105, -145], [100, 96], [80, 84]),
    ],
  },
];

const exercises: Exercise[] = exerciseMotion.map((motion, i) => ({
  ...motion,
  name: athleteCopy.exercises[i].name,
  benefit: athleteCopy.exercises[i].benefit,
}));

const duration = (ex: Exercise) => ex.reps * ex.poses.length * (ex.move + ex.hold);

const toRad = (deg: number) => (deg * Math.PI) / 180;
const polar = (from: Pt, length: number, deg: number): Pt => [
  from[0] + length * Math.cos(toRad(deg)),
  from[1] + length * Math.sin(toRad(deg)),
];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPair = (a: [number, number], b: [number, number], t: number): [number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
];

function mix(a: Pose, b: Pose, t: number): Pose {
  return {
    hip: lerpPair(a.hip, b.hip, t),
    torso: lerp(a.torso, b.torso, t),
    head: lerp(a.head, b.head, t),
    arm1: lerpPair(a.arm1, b.arm1, t),
    arm2: lerpPair(a.arm2, b.arm2, t),
    leg1: lerpPair(a.leg1, b.leg1, t),
    leg2: lerpPair(a.leg2, b.leg2, t),
  };
}

/** Returns [joint, end] for a two-part limb. A pinned limb bends so its end stays on the pin. */
function limb(root: Pt, upper: number, lower: number, angles: Limb, pin: Pt | undefined, bend: number): [Pt, Pt] {
  if (!pin) {
    const joint = polar(root, upper, angles[0]);
    return [joint, polar(joint, lower, angles[1])];
  }
  const dx = pin[0] - root[0];
  const dy = pin[1] - root[1];
  const reach = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(upper - lower) + 0.01), upper + lower - 0.01);
  const direction = Math.atan2(dy, dx);
  const offset = Math.acos((upper * upper + reach * reach - lower * lower) / (2 * upper * reach));
  const jointAngle = direction + bend * offset;
  return [
    [root[0] + upper * Math.cos(jointAngle), root[1] + upper * Math.sin(jointAngle)],
    [root[0] + reach * Math.cos(direction), root[1] + reach * Math.sin(direction)],
  ];
}

const pointList = (points: Pt[]) => points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

const SEGMENT_SPAN = 360 / exercises.length;
const segmentCenter = (i: number) => -90 + SEGMENT_SPAN / 2 + i * SEGMENT_SPAN;
const segmentPath = (i: number) => {
  const center: Pt = [100, 100];
  const start = polar(center, 92, segmentCenter(i) - SEGMENT_SPAN / 2 + 3);
  const end = polar(center, 92, segmentCenter(i) + SEGMENT_SPAN / 2 - 3);
  return `M${start[0].toFixed(2)} ${start[1].toFixed(2)} A92 92 0 0 1 ${end[0].toFixed(2)} ${end[1].toFixed(2)}`;
};

type PartName =
  | "figure"
  | "arm1"
  | "arm2"
  | "leg1"
  | "leg2"
  | "torso"
  | "head"
  | "heart"
  | "pulse"
  | "shadow"
  | "ground";

export default function HeroAthlete() {
  const [active, setActive] = useState(0);
  const parts = useRef<Partial<Record<PartName, SVGElement | null>>>({});
  const segments = useRef<(SVGPathElement | null)[]>([]);
  const bpmText = useRef<HTMLSpanElement>(null);
  const kcalText = useRef<HTMLSpanElement>(null);
  const heartIcon = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let index = 0;
    let elapsed = 0;
    let beat = 0;
    let bpm = exercises[0].bpm;
    let kcal = 0;
    let groundOffset = 0;

    const paint = (dt: number) => {
      const ex = exercises[index];
      const total = duration(ex);
      const step = ex.move + ex.hold;
      const stepIndex = Math.floor(elapsed / step);
      const progress = Math.min((elapsed - stepIndex * step) / ex.move, 1);
      const eased = ex.smooth ? progress * progress * (3 - 2 * progress) : progress;
      const from = ex.poses[stepIndex % ex.poses.length];
      const to = ex.poses[(stepIndex + 1) % ex.poses.length];
      const current = mix(from, to, eased);
      if (ex.hop) current.hip[1] -= ex.hop * Math.sin(Math.PI * progress);

      const shoulder = polar(current.hip, TORSO, current.torso);
      const head = polar(shoulder, NECK, current.head);
      const [elbow1, hand1] = limb(shoulder, UPPER_ARM, FOREARM, current.arm1, ex.pins?.arm1, 1);
      const [elbow2, hand2] = limb(shoulder, UPPER_ARM, FOREARM, current.arm2, ex.pins?.arm2, 1);
      const [knee1, foot1] = limb(current.hip, THIGH, SHIN, current.leg1, ex.pins?.leg1, -1);
      const [knee2, foot2] = limb(current.hip, THIGH, SHIN, current.leg2, ex.pins?.leg2, -1);
      const chest: Pt = lerpPair(shoulder, current.hip, 0.24);

      beat += (dt / 60000) * bpm;
      const beatPhase = beat % 1;
      const thump = Math.exp(-beatPhase * 5);
      bpm += (ex.bpm - bpm) * (1 - Math.exp(-dt / 700));
      kcal += (dt / 1000) * bpm * 0.0016;
      if (ex.travel) groundOffset += dt * 0.09;

      const el = parts.current;
      el.figure?.setAttribute("opacity", Math.max(0, Math.min(1, elapsed / FADE_MS, (total - elapsed) / FADE_MS)).toFixed(2));
      el.arm1?.setAttribute("points", pointList([shoulder, elbow1, hand1]));
      el.arm2?.setAttribute("points", pointList([shoulder, elbow2, hand2]));
      el.leg1?.setAttribute("points", pointList([current.hip, knee1, foot1]));
      el.leg2?.setAttribute("points", pointList([current.hip, knee2, foot2]));
      el.torso?.setAttribute("points", pointList([shoulder, current.hip]));
      el.head?.setAttribute("cx", head[0].toFixed(1));
      el.head?.setAttribute("cy", head[1].toFixed(1));
      el.heart?.setAttribute("cx", chest[0].toFixed(1));
      el.heart?.setAttribute("cy", chest[1].toFixed(1));
      el.heart?.setAttribute("r", (2.6 + 1.6 * thump).toFixed(2));
      el.pulse?.setAttribute("cx", chest[0].toFixed(1));
      el.pulse?.setAttribute("cy", chest[1].toFixed(1));
      el.pulse?.setAttribute("r", (3 + 12 * beatPhase).toFixed(2));
      el.pulse?.setAttribute("opacity", (0.7 * (1 - beatPhase)).toFixed(2));
      el.shadow?.setAttribute("cx", ((shoulder[0] + current.hip[0]) / 2).toFixed(1));
      el.shadow?.setAttribute("rx", (13 + 0.3 * Math.abs(shoulder[0] - current.hip[0])).toFixed(1));
      el.ground?.setAttribute("stroke-dashoffset", groundOffset.toFixed(1));

      segments.current.forEach((segment, i) => {
        const filled = i < index ? 100 : i === index ? (elapsed / total) * 100 : 0;
        segment?.setAttribute("stroke-dasharray", `${filled.toFixed(1)} 100`);
      });

      if (heartIcon.current) heartIcon.current.style.transform = `scale(${(1 + 0.28 * thump).toFixed(3)})`;
      const bpmLabel = String(Math.round(bpm));
      if (bpmText.current && bpmText.current.textContent !== bpmLabel) bpmText.current.textContent = bpmLabel;
      const kcalLabel = kcal.toFixed(1);
      if (kcalText.current && kcalText.current.textContent !== kcalLabel) kcalText.current.textContent = kcalLabel;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Static frame: the yoga pose with arms raised.
      index = 1;
      bpm = exercises[index].bpm;
      elapsed = exercises[index].move;
      setActive(index);
      paint(0);
      return;
    }

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      elapsed += dt;
      const total = duration(exercises[index]);
      if (elapsed >= total) {
        elapsed -= total;
        index = (index + 1) % exercises.length;
        setActive(index);
      }
      paint(dt);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const part = (name: PartName) => (element: SVGElement | null) => {
    parts.current[name] = element;
  };

  const limbStyle = { fill: "none", strokeWidth: 5.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const exercise = exercises[active];

  return (
    <>
      <div className="absolute inset-[12%] rounded-full bg-accent/15 blur-[90px]" />

      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label={athleteCopy.ariaLabel}
      >
        <defs>
          <radialGradient id="athlete-stage" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="#1a2026" />
            <stop offset="100%" stopColor="#06080a" />
          </radialGradient>
          <linearGradient id="athlete-ground" gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="170" y2="0">
            <stop offset="0%" stopColor="#d4ff00" stopOpacity="0" />
            <stop offset="50%" stopColor="#d4ff00" />
            <stop offset="100%" stopColor="#d4ff00" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle cx="100" cy="100" r="84" fill="url(#athlete-stage)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />

        {exercises.map((ex, i) => (
          <g key={ex.name} fill="none" strokeWidth="2.5">
            <path d={segmentPath(i)} stroke="rgba(255,255,255,0.12)" />
            <path
              ref={(element) => {
                segments.current[i] = element;
              }}
              d={segmentPath(i)}
              pathLength={100}
              strokeDasharray="0 100"
              stroke="#d4ff00"
              className="drop-shadow-[0_0_4px_#d4ff00]"
            />
          </g>
        ))}

        <line
          ref={part("ground")}
          x1="30"
          y1="148.6"
          x2="170"
          y2="148.6"
          stroke="url(#athlete-ground)"
          strokeWidth="1"
          strokeDasharray="5 7"
        />

        <g
          ref={part("figure")}
          transform="translate(20 10) scale(0.8)"
          opacity="0"
          className="drop-shadow-[0_0_10px_rgba(212,255,0,0.45)]"
        >
          <ellipse ref={part("shadow")} cx="100" cy="174" rx="14" ry="1.6" fill="rgba(212,255,0,0.18)" />
          <polyline ref={part("arm2")} {...limbStyle} stroke="#00f0ff" opacity="0.8" />
          <polyline ref={part("leg2")} {...limbStyle} stroke="#00f0ff" opacity="0.8" />
          <polyline ref={part("torso")} {...limbStyle} stroke="#d4ff00" strokeWidth={6.5} />
          <polyline ref={part("leg1")} {...limbStyle} stroke="#d4ff00" />
          <polyline ref={part("arm1")} {...limbStyle} stroke="#d4ff00" />
          <circle ref={part("head")} r={HEAD_RADIUS} fill="#d4ff00" />
          <circle ref={part("pulse")} r="3" fill="none" stroke="#ff2e63" strokeWidth="1" />
          <circle ref={part("heart")} r="2.6" fill="#ff2e63" />
        </g>
      </svg>

      {exercises.map((ex, i) => {
        const angle = toRad(segmentCenter(i));
        const state =
          i === active
            ? "border-accent bg-accent text-ink-950"
            : i < active
              ? "border-accent/40 bg-ink-950/85 text-accent"
              : "border-white/15 bg-ink-950/85 text-zinc-400";
        return (
          <span
            key={ex.name}
            style={{ left: `${50 + 46 * Math.cos(angle)}%`, top: `${50 + 46 * Math.sin(angle)}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 sm:text-xs ${state}`}
          >
            {ex.name}
          </span>
        );
      })}

      <div key={exercise.name} className="absolute inset-x-0 top-[77%] animate-rise text-center">
        <p className="font-display text-sm font-black uppercase text-white sm:text-xl">{exercise.name}</p>
        <p className="hud-label mt-0.5 !text-[9px] !text-accent sm:mt-1 sm:!text-[11px]">{exercise.benefit}</p>
      </div>

      <div className="absolute -left-2 top-[30%] animate-float border border-white/10 bg-ink-950/80 p-3 backdrop-blur-xl sm:-left-8 sm:p-4">
        <Corners />
        <p className="hud-label flex items-center gap-1.5 !text-[9px]">
          <span ref={heartIcon} className="inline-flex">
            <Heart className="h-3 w-3 fill-pulse text-pulse" />
          </span>
          {ui.hud.heartRate}
        </p>
        <p className="mt-1 font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
          <span ref={bpmText}>{exercises[0].bpm}</span>
          <span className="ml-1 font-mono text-xs text-pulse">{ui.units.bpm}</span>
        </p>
      </div>

      <div className="absolute -right-2 top-[40%] animate-float border border-white/10 bg-ink-950/80 p-3 backdrop-blur-xl [animation-delay:-3s] sm:-right-6 sm:p-4">
        <Corners className="border-plasma" />
        <p className="hud-label flex items-center gap-1.5 !text-[9px]">
          <Flame className="h-3 w-3 text-orange-400" /> {ui.hud.burned}
        </p>
        <p className="mt-1 font-display text-2xl font-bold tabular-nums text-white sm:text-3xl">
          <span ref={kcalText}>0.0</span>
          <span className="ml-1 font-mono text-xs text-plasma">{ui.units.kcal}</span>
        </p>
      </div>
    </>
  );
}
