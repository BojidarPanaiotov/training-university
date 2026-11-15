import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, Star, Users } from "lucide-react";
import type { Course } from "../types";
import { Corners } from "./Hud";
import ui from "../locales/bg/ui.json";
import { format } from "../locales/format";

export default function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  return (
    <Link
      to={`/courses/${course.slug}`}
      style={{ animationDelay: `${index * 120}ms` }}
      className="group relative flex animate-rise flex-col overflow-hidden border border-white/10 bg-ink-900 transition duration-300 hover:-translate-y-1 hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-accent"
    >
      <Corners className="border-white/0 transition-colors group-hover:border-accent" />
      <div className="relative h-44 overflow-hidden bg-ink-800">
        <img
          src={course.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 to-transparent" />
        <span className="hud-label absolute left-4 top-4 border border-white/15 bg-ink-950/60 px-2 py-1 !text-white backdrop-blur">
          {course.code}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="hud-label !text-accent">
          {course.category} · {course.level}
        </p>
        <h3 className="mt-2 text-xl font-bold uppercase">{course.title}</h3>
        <p className="mt-2 flex-1 text-sm text-zinc-400">{course.tagline}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-zinc-300">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {course.rating}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {course.students.toLocaleString(ui.locale)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {format(ui.card.hours, { hours: course.hours })}
          </span>
        </div>

        <span className="mt-6 inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-widest text-accent">
          {ui.card.start}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  );
}
