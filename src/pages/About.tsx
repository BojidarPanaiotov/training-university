import { Corners } from "../components/Hud";
import ui from "../locales/bg/ui.json";

const { about: copy } = ui;

const photos = [
  "https://images.pexels.com/photos/3153134/pexels-photo-3153134.jpeg?auto=compress&cs=tinysrgb&w=1400",
  "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?w=1400&q=80&auto=format&fit=crop",
  "https://images.pexels.com/photos/35021561/pexels-photo-35021561.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

const frames = ["object-[center_62%]", "object-center", "object-[center_78%]"];

export default function About() {
  return (
    <>
      <section className="grid grid-cols-1 gap-2 bg-ink-950 p-2 md:grid-cols-3">
        {copy.panels.map((panel, i) => (
          <figure key={panel.label} className="group relative h-[28rem] overflow-hidden md:h-[min(78vh,46rem)]">
            <img
              src={photos[i]}
              alt={panel.alt}
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] ${frames[i]}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/15 to-ink-950/25" />
            <Corners className="border-white/70" />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
              <span className="font-display text-2xl font-black uppercase leading-none tracking-tight text-white sm:text-3xl">
                {panel.label}
              </span>
              <span className="hud-label text-accent">0{i + 1}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <p className="hud-label flex items-center gap-3 text-accent">
          <span className="text-zinc-500">// 01</span>
          <span className="h-px w-10 bg-accent/60" />
          {copy.kicker}
        </p>
        <h1 className="mt-6 font-display text-4xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-6xl">
          {copy.title}
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-zinc-300">{copy.text}</p>
      </section>
    </>
  );
}
