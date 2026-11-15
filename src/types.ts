export type Level = "Начинаещ" | "Средно" | "Напреднал";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  summary: string;
  body: string[];
}

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  level: Level;
  hours: number;
  rating: number;
  students: number;
  instructor: { name: string; role: string };
  gradient: string;
  image: string;
  code: string;
  outcomes: string[];
  lessons: Lesson[];
  questions: Question[];
}

export interface AnswerRecord {
  questionId: string;
  selected: number;
  correct: boolean;
}

export interface ResultsState {
  answers: AnswerRecord[];
  seconds: number;
}
