
// components/admin/CourseApi.js
let courses = [
  {
    id: 1,
    title: "React Basics",
    slug: "react-basics",
    summary: "Introduction to React components, props, and state.",
    description:
      "## React Basics\nLearn components, JSX, props, state, and hooks.\n\n- Components\n- Props\n- State\n- Hooks",
    thumbnail: "",
    categories: ["Web Development"],
    duration: "4 weeks",
    level: "beginner",
    price: 0,
    students: 120,
    status: "published",
  },
  {
    id: 2,
    title: "JavaScript Deep Dive",
    slug: "javascript-deep-dive",
    summary: "Advanced concepts in modern JavaScript.",
    description:
      "## JavaScript Deep Dive\nScopes, closures, prototypes, async/await, and performance.",
    thumbnail: "",
    categories: ["Web Development"],
    duration: "6 weeks",
    level: "intermediate",
    price: 0,
    students: 85,
    status: "published",
  },
  {
    id: 3,
    title: ".NET Fundamentals",
    slug: "dotnet-fundamentals",
    summary: "Essentials of .NET ecosystem.",
    description:
      "## .NET Fundamentals\nCLR, C#, tooling, and ecosystem overview.",
    thumbnail: "",
    categories: ["Backend", "Languages"],
    duration: "5 weeks",
    level: "beginner",
    price: 0,
    students: 45,
    status: "draft",
  },
];

let nextId = 4;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const normalizeSlug = (s) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getAllCourses = async () => {
  await delay(300);
  // return a shallow copy to avoid accidental external mutations
  return courses.map((c) => ({ ...c }));
};

export const getCourseById = async (id) => {
  await delay(200);
  return courses.find((c) => c.id === id) || null;
};

export const getCourseBySlug = async (slug) => {
  await delay(150);
  const key = normalizeSlug(slug);
  return courses.find((c) => c.slug === key) || null;
};

export const createCourse = async (course) => {
  await delay(400);
  const slug = normalizeSlug(course.slug || course.title);
  if (!slug) throw new Error("Slug is required");
  const exists = courses.some((c) => c.slug === slug);
  if (exists) throw new Error("Slug already exists");

  const newCourse = {
    id: nextId++,
    title: course.title?.trim() || "",
    slug,
    summary: (course.summary || "").trim(),
    description: course.description || "",
    thumbnail: course.thumbnail || "",
    categories: Array.isArray(course.categories) ? course.categories : [],
    duration: course.duration || "",
    level: course.level || "beginner",
    price: Number(course.price) || 0,
    students: Number(course.students) || 0,
    status: course.status || "published",
    assessment: course.assessment || null,
    quiz: course.quiz || { timeLimit: 30, passingScore: 70, questions: [] },
  };
  courses.push(newCourse);
  return { ...newCourse };
};

export const updateCourse = async (id, updates) => {
  await delay(300);
  const idx = courses.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  const next = { ...courses[idx], ...updates };

  // if slug changes, enforce uniqueness
  if (updates.slug) {
    next.slug = normalizeSlug(updates.slug);
    const conflict = courses.some(
      (c) => c.slug === next.slug && c.id !== id
    );
    if (conflict) throw new Error("Slug already exists");
  }

  // normalize types
  next.price = Number(next.price) || 0;
  next.students = Number(next.students) || 0;

  courses[idx] = next;
  return { ...courses[idx] };
};

export const deleteCourse = async (id) => {
  await delay(300);
  courses = courses.filter((c) => c.id !== id);
  return true;
};
