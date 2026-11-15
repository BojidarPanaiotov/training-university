import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ArrowRight, CircleCheck, CircleX, RotateCcw, Sparkles, Target, Timer, Trophy } from "lucide-react";
import ProgressRing from "../components/ProgressRing";
import CourseCard from "../components/CourseCard";
import { courses, getCourse } from "../data/courses";
import type { ResultsState } from "../types";
import ui from "../locales/bg/ui.json";
import { format } from "../locales/format";

function verdict(percent: number) {
  const { verdicts } = ui.results;
  if (percent === 100) return verdicts.perfect;
  if (percent >= 80) return verdicts.excellent;
  if (percent >= 50) return verdicts.good;
  return verdicts.keepGoing;
}

export default function Results() {
  const { slug } = useParams();
  const course = getCourse(slug);
  const state = useLocation().state as ResultsState | null;

  if (!course) return <Navigate to="/" replace />;
  if (!state?.answers?.length) return <Navigate to={`/courses/${course.slug}/exercise`} replace />;

  const correct = state.answers.filter((a) => a.correct).length;
  const total = course.questions.length;
  const percent = Math.round((correct / total) * 100);
  const xp = correct * 24 + (percent === 100 ? 50 : 0);
  const time = format(ui.results.timeValue, {
    minutes: Math.floor(state.seconds / 60),
    seconds: state.seconds % 60,
  });
  const { title, text } = verdict(percent);
  const nextCourse = courses.find((c) => c.slug !== course.slug)!;
  const copy = ui.results;

  const stats = [
    { icon: Target, label: copy.correct, value: `${correct}/${total}` },
    { icon: Timer, label: copy.time, value: time },
    { icon: Sparkles, label: copy.xp, value: `+${xp}` },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 pt-10">
      <section className="glass relative animate-rise overflow-hidden p-8 sm:p-12">
        <div className={`absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br ${course.gradient} opacity-30 blur-3xl`} />
        <div className="relative grid items-center gap-10 md:grid-cols-[auto_1fr]">
          <div className="mx-auto">
            <ProgressRing value={percent} label={copy.score} />
          </div>
          <div className="text-center md:text-left">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-accent">
              <Trophy className="h-4 w-4" /> {course.title}
            </p>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">{title}</h1>
            <p className="mt-3 text-lg text-slate-300">{text}</p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Icon className="mx-auto h-5 w-5 text-accent md:mx-0" />
                  <p className="mt-2 font-display text-2xl font-bold text-white">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link to={`/courses/${course.slug}/exercise`} className="btn-ghost">
                <RotateCcw className="h-4 w-4" /> {copy.tryAgain}
              </Link>
              <Link to="/#programs" className="btn-primary">
                {copy.allPrograms} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">{copy.review}</h2>
        <ol className="mt-6 space-y-3">
          {course.questions.map((q, i) => {
            const record = state.answers.find((a) => a.questionId === q.id);
            const ok = record?.correct ?? false;
            return (
              <li
                key={q.id}
                style={{ animationDelay: `${i * 80}ms` }}
                className={`flex animate-rise gap-4 rounded-2xl border p-5 ${
                  ok ? "border-emerald-400/20 bg-emerald-400/[0.06]" : "border-rose-400/20 bg-rose-400/[0.06]"
                }`}
              >
                {ok ? (
                  <CircleCheck className="h-6 w-6 shrink-0 text-emerald-400" />
                ) : (
                  <CircleX className="h-6 w-6 shrink-0 text-rose-400" />
                )}
                <div>
                  <p className="font-medium text-white">
                    {i + 1}. {q.prompt}
                  </p>
                  {!ok && record && (
                    <p className="mt-1 text-sm text-rose-300">
                      {format(copy.yourAnswer, { answer: q.options[record.selected] })}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-emerald-300">
                    {format(copy.correctAnswer, { answer: q.options[q.answer] })}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{q.explanation}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold">
          {copy.upNextLead} <span className="gradient-text">{copy.upNextAccent}</span>
        </h2>
        <div className="mt-6 max-w-sm">
          <CourseCard course={nextCourse} />
        </div>
      </section>
    </div>
  );
}
