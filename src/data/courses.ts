import type { Course, Level } from "../types";
import content from "../locales/bg/courses.json";

const img = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export const heroImage = img("1550345332-09e3ac987658", 900);

const presentation: Record<
  string,
  {
    code: string;
    hours: number;
    rating: number;
    students: number;
    instructorName: string;
    gradient: string;
    image: string;
  }
> = {
  "calisthenics-foundations": {
    code: "CAL-01",
    hours: 10,
    rating: 4.9,
    students: 24810,
    instructorName: "Marko Vidal",
    gradient: "from-accent via-lime-400 to-emerald-500",
    image: img("1598971639058-fab3c3109a00"),
  },
  "power-yoga-flow": {
    code: "YOG-02",
    hours: 8,
    rating: 4.9,
    students: 31240,
    instructorName: "Leila Haddad",
    gradient: "from-pulse via-fuchsia-500 to-plasma",
    image: img("1544367567-0f2fcb009e0b"),
  },
  "zero-to-5k": {
    code: "RUN-03",
    hours: 12,
    rating: 4.8,
    students: 42115,
    instructorName: "Jonas Berg",
    gradient: "from-plasma via-sky-500 to-indigo-500",
    image: img("1552674605-db6ffd4facb5"),
  },
  "mobility-stretching": {
    code: "MOB-04",
    hours: 6,
    rating: 4.9,
    students: 19480,
    instructorName: "Sofia Laurent",
    gradient: "from-amber-300 via-orange-500 to-pulse",
    image: img("1562771379-eafdca7a02f8"),
  },
  "hiit-strength": {
    code: "HIIT-05",
    hours: 9,
    rating: 4.8,
    students: 27630,
    instructorName: "Andre Okoye",
    gradient: "from-pulse via-orange-500 to-accent",
    image: img("1599058917212-d750089bc07e"),
  },
};

export const courses: Course[] = content.courses.map((course) => {
  const meta = presentation[course.slug];
  return {
    slug: course.slug,
    code: meta.code,
    title: course.title,
    tagline: course.tagline,
    category: course.category,
    level: course.level as Level,
    hours: meta.hours,
    rating: meta.rating,
    students: meta.students,
    instructor: { name: meta.instructorName, role: course.instructorRole },
    gradient: meta.gradient,
    image: meta.image,
    outcomes: course.outcomes,
    lessons: course.lessons,
    questions: course.questions,
  };
});

export const getCourse = (slug: string | undefined) => courses.find((c) => c.slug === slug);

export const testimonials = content.testimonials;
