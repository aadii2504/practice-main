/* eslint-disable no-empty */
const LS_KEY = "learnsphere_enrollments";
const listeners = new Set();
let enrollments = (() => {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    }
  } catch {}
  return [];
})();
function save() {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LS_KEY, JSON.stringify(enrollments));
    }
  } catch {}
}

function emit() {
  listeners.forEach((fn) => fn());
}

// External Store API
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getSnapshot() {
  return enrollments;
}

// Mutations
export function enrollCourse(course) {
  if (!enrollments.some((c) => c.id === course.id)) {
    enrollments = [...enrollments, course];
    save();
    emit();
  }
}

export function unenrollCourse(id) {
  enrollments = enrollments.filter((c) => c.id !== id);
  save();
  emit();
}

// Cross-tab sync
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === LS_KEY) {
      try {
        enrollments = e.newValue ? JSON.parse(e.newValue) : [];
        emit();
      } catch {}
    }
  });
}