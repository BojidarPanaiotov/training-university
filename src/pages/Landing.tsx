import { Link } from "react-router-dom";
import { Activity, ArrowRight, ArrowUpRight, CirclePlay as PlayCircle, Flame, Gauge, Target, Zap } from "lucide-react";
import { Corners, CountUp, Ecg, LiveNumber } from "../components/Hud";
import { courses, heroImage, testimonials } from "../data/courses";
import ui from "../locales/bg/ui.json";
import { format } from "../locales/format";

const { landing: copy } = ui;
const disciplines = copy.disciplines;

const orbitChips = courses.map((c, i) => ({ label: c.category, angle: (360 / courses.length) * i - 90 }));

const protocolIcons = [PlayCircle, Target, Gauge];
const protocol = copy.protocol.map((step, i) => ({ ...step, icon: protocolIcons[i] }));

const metricValues = [78, 64, 86, 71];
const metricColors = [
  "from-accent to-lime-300",
  "from-plasma to-sky-400",
  "from-pulse to-orange-400",
  "from-fuchsia-400 to-plasma",
];
const metrics = copy.metrics.map((label, i) => ({ label, value: metricValues[i], color: metricColors[i] }));

function SectionTag({ n, children }: { n: string; children: string }) {
  return (
    <p className="hud-label flex items-center gap-3 text-accent">
      <span className="text-zinc-500">// {n}</span>
      <span className="h-px w-10 bg-accent/60" />
      {children}
    </p>
  );
}

export default function Landing() {
  const [lead, ...rest] = courses;

  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-12 px-5 pb-10 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div className="relative z-10">
          <p className="hud-label flex animate-rise items-center gap-3">
            <span className="flex items-center gap-2 text-accent">
              <span className="h-2 w-2 animate-blink bg-accent" /> {copy.online}
            </span>
            <span className="text-zinc-500">|</span>
            <span>
              <LiveNumber min={2410} max={2560} interval={1400} /> {copy.trainingNow}
            </span>
          </p>

          <h1 className="mt-8 font-display text-[clamp(3.2rem,9vw,7.5rem)] font-black uppercase leading-[0.88] tracking-[-0.04em]">
            <span className="block animate-rise [animation-delay:100ms]">{copy.headline[0]}</span>
            <span className="outline-text block animate-rise [animation-delay:200ms]">{copy.headline[1]}</span>
            <span className="gradient-text block animate-rise [animation-delay:300ms]">{copy.headline[2]}</span>
          </h1>

          <p className="mt-8 max-w-lg animate-rise text-lg leading-relaxed text-zinc-400 [animation-delay:400ms]">
            {copy.intro}
          </p>

          <div className="mt-10 flex animate-rise flex-wrap gap-4 [animation-delay:500ms]">
            <a href="#programs" className="btn-primary group">
              {copy.startTraining}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link to={`/courses/${lead.slug}`} className="btn-ghost">
              <PlayCircle className="h-4 w-4" /> {copy.freeSession}
            </Link>
          </div>

          <dl className="mt-14 grid max-w-md animate-rise grid-cols-3 border-t border-white/10 pt-6 [animation-delay:600ms]">
            {[
              [copy.heroStats[0], "05"],
              [copy.heroStats[1], "24"],
              [copy.heroStats[2], "87"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="hud-label">{label}</dt>
                <dd className="mt-1 font-display text-3xl font-bold text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* HUD orb */}
        <div className="relative mx-auto aspect-square w-[82%] max-w-[560px] sm:w-full animate-rise [animation-delay:250ms]">
          <div className="absolute inset-[12%] rounded-full bg-accent/20 blur-[90px]" />
          <div className="absolute inset-0 animate-spin-slower rounded-full border border-dashed border-white/15" />
          <div className="absolute inset-[6%] animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,#d4ff00_70deg,transparent_140deg,transparent_200deg,#00f0ff_260deg,transparent_320deg)] [mask:radial-gradient(farthest-side,transparent_calc(100%-3px),#000_calc(100%-2px))]" />
          <svg viewBox="0 0 200 200" className="absolute inset-[10%] animate-spin-slower" aria-hidden>
            {Array.from({ length: 72 }, (_, i) => (
              <line
                key={i}
                x1="100"
                y1="2"
                x2="100"
                y2={i % 6 === 0 ? 9 : 5}
                stroke={i % 6 === 0 ? "#d4ff00" : "rgba(255,255,255,0.25)"}
                strokeWidth={i % 6 === 0 ? 1 : 0.5}
                transform={`rotate(${i * 5} 100 100)`}
              />
            ))}
          </svg>

          <div className="absolute inset-[17%] overflow-hidden rounded-full border border-white/15 bg-ink-800">
            <img
              src={heroImage}
              alt={copy.heroAlt}
              className="h-full w-full scale-110 object-cover grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 via-transparent to-plasma/40 mix-blend-color" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_45%,rgba(3,4,5,0.85)_100%)]" />
            <div className="absolute inset-x-0 h-px animate-scan bg-accent shadow-[0_0_18px_4px_rgba(212,255,0,0.6)]" />
          </div>

          <div className="absolute inset-0 animate-orbit">
            {orbitChips.map(({ label, angle }) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <div
                  key={label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${50 + 47 * Math.cos(rad)}%`, top: `${50 + 47 * Math.sin(rad)}%` }}
                >
                  <span className="block animate-orbit-reverse whitespace-nowrap border border-white/15 bg-ink-950/80 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur sm:text-xs">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="absolute -left-2 top-[14%] animate-float border border-white/10 bg-ink-950/80 p-3 backdrop-blur-xl sm:-left-8 sm:p-4">
            <Corners />
            <p className="hud-label flex items-center gap-1.5 !text-[9px]">
              <Activity className="h-3 w-3 text-pulse" /> {ui.hud.heartRate}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              <LiveNumber min={136} max={152} />
              <span className="ml-1 font-mono text-xs text-pulse">{ui.units.bpm}</span>
            </p>
          </div>

          <div className="absolute -right-2 bottom-[16%] animate-float border border-white/10 bg-ink-950/80 p-3 backdrop-blur-xl [animation-delay:-3s] sm:-right-6 sm:p-4">
            <Corners className="border-plasma" />
            <p className="hud-label flex items-center gap-1.5 !text-[9px]">
              <Flame className="h-3 w-3 text-orange-400" /> {ui.hud.burned}
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
              486<span className="ml-1 font-mono text-xs text-plasma">{ui.units.kcal}</span>
            </p>
          </div>

          <div className="absolute bottom-[2%] left-[8%] hidden animate-float border border-accent/40 bg-accent px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-ink-950 [animation-delay:-1.5s] sm:block">
            <Zap className="mr-1 inline h-3 w-3" /> {copy.streak}
          </div>
        </div>
      </section>

      <Ecg className="h-16 w-full sm:h-24" />

      {/* MARQUEE */}
      <section aria-label={copy.disciplinesLabel} className="relative my-16 h-40 sm:h-48">
        <div className="absolute inset-x-[-5%] top-6 rotate-[2deg] overflow-hidden border-y border-white/10 py-3">
          <div className="flex w-max animate-marquee [animation-direction:reverse]">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
                {disciplines.map((d) => (
                  <span key={d} className="outline-text px-6 font-display text-4xl font-black uppercase sm:text-6xl">
                    {d} <span className="text-plasma [-webkit-text-stroke:0]">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-[-5%] top-14 -rotate-[2deg] overflow-hidden bg-accent py-3 shadow-[0_0_60px_-10px_#d4ff00] sm:top-16">
          <div className="flex w-max animate-marquee">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
                {disciplines.map((d) => (
                  <span key={d} className="px-6 font-display text-4xl font-black uppercase text-ink-950 sm:text-6xl">
                    {d} ✦
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMS BENTO */}
      <section id="programs" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionTag n="01">{copy.programsTag}</SectionTag>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none sm:text-6xl">
              {copy.programsTitleLead} <span className="gradient-text">{copy.programsTitleAccent}</span>
            </h2>
          </div>
          <p className="max-w-sm text-zinc-400">{copy.programsText}</p>
        </div>

        <div className="mt-12 grid auto-rows-[18rem] gap-4 md:grid-cols-2 lg:auto-rows-[20rem] lg:grid-cols-3">
          {[lead, ...rest].map((c, i) => (
            <Link
              key={c.slug}
              to={`/courses/${c.slug}`}
              className={`group relative overflow-hidden border border-white/10 bg-ink-800 focus-visible:outline-2 focus-visible:outline-accent ${
                i === 0 ? "md:row-span-2" : ""
              }`}
            >
              <img
                src={c.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale transition duration-700 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
              <div
                className={`absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${c.gradient} transition-transform duration-500 group-hover:scale-x-100`}
              />
              <Corners className="border-white/0 transition-colors group-hover:border-accent" />

              <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <span className="hud-label border border-white/15 bg-ink-950/60 px-2 py-1 !text-white backdrop-blur">
                    {c.code}
                  </span>
                  <span className="grid h-10 w-10 place-items-center bg-white/10 backdrop-blur transition group-hover:rotate-45 group-hover:bg-accent group-hover:text-ink-950">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
                <div>
                  <p className="hud-label !text-accent">
                    {c.level} · {format(ui.card.hours, { hours: c.hours })} · ★ {c.rating}
                  </p>
                  <h3
                    className={`mt-2 font-black uppercase leading-[0.95] ${i === 0 ? "text-4xl sm:text-6xl" : "text-2xl sm:text-3xl"}`}
                  >
                    {c.category}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-300">{c.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROTOCOL */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <SectionTag n="02">{copy.protocolTag}</SectionTag>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none sm:text-6xl">
              {copy.protocolTitleLead} <span className="outline-text">{copy.protocolTitleAccent}</span>
            </h2>
            <ol className="mt-12 space-y-4">
              {protocol.map(({ n, icon: Icon, title, text }) => (
                <li
                  key={n}
                  className="group relative grid grid-cols-[auto_1fr] items-center gap-6 border border-white/10 bg-white/[0.02] p-5 transition hover:border-accent/50 hover:bg-accent/[0.04]"
                >
                  <span className="outline-text font-display text-5xl font-black transition group-hover:[-webkit-text-stroke-color:#d4ff00]">
                    {n}
                  </span>
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-bold uppercase">
                      <Icon className="h-5 w-5 text-accent" /> {title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative border border-white/10 bg-ink-900/80 p-6 backdrop-blur-xl sm:p-8">
            <Corners />
            <div className="flex items-center justify-between">
              <p className="hud-label">{copy.scanTitle}</p>
              <p className="hud-label flex items-center gap-2 !text-accent">
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-accent" /> {ui.hud.live}
              </p>
            </div>
            <p className="mt-6 font-display text-6xl font-black text-white">
              <CountUp to={92} />
              <span className="text-2xl text-accent">/100</span>
            </p>
            <p className="mt-1 text-sm text-zinc-400">{copy.scoreCaption}</p>
            <div className="mt-8 space-y-5">
              {metrics.map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                    <span className="text-zinc-300">{m.label}</span>
                    <span className="text-white">{m.value}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-white/5">
                    <div
                      className={`h-full bg-gradient-to-r ${m.color} shadow-[0_0_12px_rgba(212,255,0,0.4)]`}
                      style={{ width: `${m.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="hud-label mt-8">{copy.lastDays}</p>
            <div className="mt-3 grid grid-cols-14 gap-1" aria-label={copy.streakCalendar}>
              {Array.from({ length: 28 }, (_, i) => {
                const level = [3, 2, 0, 3, 1, 3, 2, 3, 3, 0, 2, 3, 1, 3, 3, 2, 3, 0, 3, 3, 2, 3, 3, 1, 3, 3, 3, 3][i];
                const shade = ["bg-white/5", "bg-accent/25", "bg-accent/55", "bg-accent"][level];
                return <span key={i} className={`aspect-square ${shade}`} />;
              })}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 px-5 lg:grid-cols-4 lg:divide-x">
          {[
            { label: copy.stats[0], node: <CountUp to={145} suffix={copy.statSuffixes[0]} /> },
            { label: copy.stats[1], node: <CountUp to={4.9} decimals={1} suffix={copy.statSuffixes[1]} /> },
            { label: copy.stats[2], node: <CountUp to={92} suffix={copy.statSuffixes[2]} /> },
            { label: copy.stats[3], node: <CountUp to={3.2} decimals={1} suffix={copy.statSuffixes[3]} /> },
          ].map((s) => (
            <div key={s.label} className="px-2 py-10 text-center lg:px-6">
              <dd className="font-display text-4xl font-black text-white sm:text-5xl">{s.node}</dd>
              <dt className="hud-label mt-3">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* TESTIMONIALS */}
      <section id="stories" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24">
        <SectionTag n="03">{copy.storiesTag}</SectionTag>
        <h2 className="mt-4 text-4xl font-black uppercase leading-none sm:text-6xl">
          {copy.storiesTitleLead} <span className="gradient-text">{copy.storiesTitleAccent}</span>
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="group relative flex flex-col border border-white/10 bg-white/[0.02] p-7 transition hover:-translate-y-1 hover:border-accent/40"
            >
              <span className="font-display text-6xl leading-none text-accent">"</span>
              <blockquote className="mt-2 flex-1 text-lg leading-relaxed text-zinc-200">{t.quote}</blockquote>
              <figcaption className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <span>
                  <span className="block font-bold text-white">{t.name}</span>
                  <span className="hud-label mt-1 block">{t.role}</span>
                </span>
                <span className="font-mono text-xs text-zinc-500">0{i + 1}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-8">
        <div className="chamfer relative overflow-hidden bg-accent px-8 py-20 text-center sm:py-28">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(3,4,5,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(3,4,5,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <p className="hud-label relative !text-ink-950/70">{copy.ctaKicker}</p>
          <h2 className="relative mx-auto mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] !text-ink-950 sm:text-7xl">
            {copy.ctaTitle}
          </h2>
          <a
            href="#programs"
            className="chamfer relative mt-10 inline-flex items-center gap-2 bg-ink-950 px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest text-accent transition hover:bg-ink-800"
          >
            {copy.ctaButton} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </>
  );
}
