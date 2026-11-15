import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CirclePlay, Clock, Play, Star, Target, Users } from "lucide-react";
import { getCourse } from "../data/courses";
import { Corners } from "../components/Hud";
import ui from "../locales/bg/ui.json";
import { format } from "../locales/format";

export default function Course() {
  const { slug } = useParams();
  const course = getCourse(slug);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));

  if (!course) return <Navigate to="/" replace />;

  const lesson = course.lessons[activeIndex];
  const isLast = activeIndex === course.lessons.length - 1;
  const copy = ui.course;

  const openLesson = (index: number) => {
    setActiveIndex(index);
    setVisited((prev) => new Set(prev).add(index));
  };

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8">
      <Link to="/#programs" className="hud-label inline-flex items-center gap-2 hover:!text-white">
        <ArrowLeft className="h-4 w-4" /> {copy.allPrograms}
      </Link>

      <header className="relative mt-6 overflow-hidden border border-white/10 p-8 sm:p-10">
        <img src={course.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/30" />
        <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${course.gradient}`} />
        <Corners />
        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="animate-rise">
            <p className="hud-label !text-accent">
              {course.code} · {course.category} · {course.level}
            </p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-300">{course.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent text-accent" /> {format(copy.rating, { rating: course.rating })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {format(copy.students, { count: course.students.toLocaleString(ui.locale) })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {format(copy.hours, { hours: course.hours })}
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              {copy.taughtBy} <span className="font-semibold text-white">{course.instructor.name}</span>,{" "}
              {course.instructor.role}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <button type="button" onClick={() => openLesson(0)} className="btn-primary">
              {copy.startTraining} <ArrowRight className="h-4 w-4" />
            </button>
            <Link to={`/courses/${course.slug}/exercise`} className="btn-ghost">
              <Target className="h-4 w-4" /> {copy.jumpToExercise}
            </Link>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="glass h-fit p-4 lg:sticky lg:top-24">
          <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {format(copy.lessonsProgress, { visited: visited.size, total: course.lessons.length })}
          </p>
          <ol className="space-y-1">
            {course.lessons.map((l, i) => {
              const active = i === activeIndex;
              const done = visited.has(i) && !active;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => openLesson(i)}
                    aria-current={active ? "step" : undefined}
                    className={`flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left transition ${
                      active ? "border-accent bg-accent/[0.06]" : "border-transparent hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center font-mono text-xs font-bold ${
                        done
                          ? "bg-accent text-ink-950"
                          : active
                            ? "border border-accent text-accent"
                            : "bg-white/10 text-zinc-300"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-white">{l.title}</span>
                      <span className="block text-xs text-slate-400">{l.duration}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <Link
            to={`/courses/${course.slug}/exercise`}
            className="mt-3 flex items-center gap-3 border border-dashed border-accent/40 px-3 py-3 font-mono text-xs font-bold uppercase tracking-wider text-accent hover:bg-accent/10"
          >
            <Target className="h-5 w-5" /> {format(copy.finalExercise, { count: course.questions.length })}
          </Link>
        </aside>

        <article key={lesson.id} className="glass animate-rise overflow-hidden">
          <div className="relative aspect-video bg-ink-800">
            <img src={course.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-ink-950/45" />
            <span className="hud-label absolute left-4 top-4 flex items-center gap-2 bg-ink-950/70 px-2 py-1 !text-white">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-pulse" /> {copy.recording}
            </span>
            <button
              type="button"
              aria-label={format(copy.play, { title: lesson.title })}
              className="group absolute inset-0 grid place-items-center"
            >
              <span className="chamfer grid h-20 w-20 place-items-center bg-accent shadow-2xl transition group-hover:scale-110">
                <Play className="ml-1 h-8 w-8 fill-ink-950 text-ink-950" />
              </span>
            </button>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-ink-950/80 to-transparent px-5 pb-4 pt-10 text-xs text-white">
              <CirclePlay className="h-4 w-4" />
              <div className="h-1 flex-1 rounded-full bg-white/25">
                <div className="h-full w-1/4 rounded-full bg-accent" />
              </div>
              <span>{lesson.duration}</span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              {format(copy.lessonProgress, { current: activeIndex + 1, total: course.lessons.length })}
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase">{lesson.title}</h2>
            <p className="mt-2 text-slate-400">{lesson.summary}</p>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-300">
              {lesson.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {activeIndex === 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">{copy.outcomesTitle}</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-slate-200">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {o}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
              <button
                type="button"
                onClick={() => openLesson(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="btn-ghost disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" /> {copy.previous}
              </button>
              {isLast ? (
                <Link to={`/courses/${course.slug}/exercise`} className="btn-primary">
                  {copy.startExercise} <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button type="button" onClick={() => openLesson(activeIndex + 1)} className="btn-primary">
                  {copy.nextLesson} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
