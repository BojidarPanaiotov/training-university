import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CircleCheck, CircleX, Flame, Timer, X } from "lucide-react";
import { getCourse } from "../data/courses";
import type { AnswerRecord, ResultsState } from "../types";
import ui from "../locales/bg/ui.json";
import { format } from "../locales/format";

const letters = ui.exercise.letters;

export default function Exercise() {
  const { slug } = useParams();
  const course = getCourse(slug);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!course) return <Navigate to="/" replace />;

  const questions = course.questions;
  const question = questions[index];
  const answered = selected !== null;
  const isCorrect = answered && selected === question.answer;
  const isLast = index === questions.length - 1;
  const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100;

  let streak = 0;
  for (let i = answers.length - 1; i >= 0 && answers[i].correct; i--) streak++;

  const choose = (option: number) => {
    if (answered) return;
    setSelected(option);
    setAnswers((prev) => [...prev, { questionId: question.id, selected: option, correct: option === question.answer }]);
  };

  const next = () => {
    if (isLast) {
      const state: ResultsState = { answers, seconds };
      navigate(`/courses/${course.slug}/results`, { state });
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const copy = ui.exercise;

  return (
    <div className="mx-auto max-w-3xl px-5 pt-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/courses/${course.slug}`}
          aria-label={copy.exit}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Link>
        <div
          className="h-3 flex-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-plasma via-lime-300 to-accent transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-3 text-sm font-medium">
          <span
            className={`flex items-center gap-1 transition ${streak >= 2 ? "text-orange-300" : "text-slate-500"}`}
            title={copy.streakTitle}
          >
            <Flame className={`h-4 w-4 ${streak >= 2 ? "fill-orange-400" : ""}`} /> {streak}
          </span>
          <span className="flex items-center gap-1 tabular-nums text-slate-400">
            <Timer className="h-4 w-4" /> {time}
          </span>
        </div>
      </div>

      <section key={question.id} className="mt-12 animate-rise">
        <p className="text-sm font-medium text-accent">
          {format(copy.questionProgress, { title: course.title, current: index + 1, total: questions.length })}
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{question.prompt}</h1>

        <div className="mt-8 grid gap-3" role="group" aria-label={copy.optionsLabel}>
          {question.options.map((option, i) => {
            const isAnswer = i === question.answer;
            const isPicked = i === selected;
            let state = "border-white/10 bg-white/[0.04] hover:border-white/30 hover:bg-white/[0.07]";
            if (answered && isAnswer) state = "border-emerald-400/70 bg-emerald-400/10 animate-pop";
            else if (answered && isPicked) state = "border-rose-400/70 bg-rose-400/10 animate-pop";
            else if (answered) state = "border-white/5 bg-white/[0.02] opacity-50";

            return (
              <button
                key={option}
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default ${state}`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display text-sm font-semibold ${
                    answered && isAnswer
                      ? "bg-emerald-400 text-ink-950"
                      : answered && isPicked
                        ? "bg-rose-400 text-ink-950"
                        : "bg-white/10 text-white"
                  }`}
                >
                  {letters[i]}
                </span>
                <span className="flex-1 font-medium text-white">{option}</span>
                {answered && isAnswer && <CircleCheck className="h-5 w-5 text-emerald-400" />}
                {answered && isPicked && !isAnswer && <CircleX className="h-5 w-5 text-rose-400" />}
              </button>
            );
          })}
        </div>
      </section>

      <div aria-live="polite" className="min-h-40">
        {answered && (
          <div
            className={`mt-8 flex animate-rise flex-col gap-4 rounded-3xl border p-6 sm:flex-row sm:items-center ${
              isCorrect ? "border-emerald-400/30 bg-emerald-400/10" : "border-rose-400/30 bg-rose-400/10"
            }`}
          >
            <div className="flex-1">
              <p className={`font-display text-xl font-bold ${isCorrect ? "text-emerald-300" : "text-rose-300"}`}>
                {isCorrect ? (streak >= 3 ? format(copy.onFire, { streak }) : copy.correct) : copy.incorrect}
              </p>
              <p className="mt-1 text-sm text-slate-300">{question.explanation}</p>
            </div>
            <button type="button" onClick={next} className="btn-primary shrink-0" autoFocus>
              {isLast ? copy.seeResults : copy.continue} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
