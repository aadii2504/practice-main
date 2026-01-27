// Analytics Store - Integrates with real course and enrollment data
import { getAllCourses } from "./CourseApi";
import { getSnapshot as getEnrollments } from "../EnrollmentStore";

const LS_KEY_ATTENDANCE = "learnsphere_attendance";
const LS_KEY_ASSESSMENTS = "learnsphere_assessments";
const LS_KEY_PROGRESS = "learnsphere_progress";
const LS_KEY_DUMMY_INIT = "learnsphere_dummy_initialized";

// Dummy student data - ONLY students, NO instructors/admins
const DUMMY_STUDENTS = [
  {
    id: "student1@example.com",
    name: "John Doe",
    email: "student1@example.com",
    role: "student",
  },
  {
    id: "student2@example.com",
    name: "Jane Smith",
    email: "student2@example.com",
    role: "student",
  },
  {
    id: "student3@example.com",
    name: "Bob Johnson",
    email: "student3@example.com",
    role: "student",
  },
  {
    id: "student4@example.com",
    name: "Alice Williams",
    email: "student4@example.com",
    role: "student",
  },
  {
    id: "student5@example.com",
    name: "Charlie Brown",
    email: "student5@example.com",
    role: "student",
  },
  {
    id: "student6@example.com",
    name: "Diana Prince",
    email: "student6@example.com",
    role: "student",
  },
  {
    id: "student7@example.com",
    name: "Eve Davis",
    email: "student7@example.com",
    role: "student",
  },
  {
    id: "student8@example.com",
    name: "Frank Miller",
    email: "student8@example.com",
    role: "student",
  },
  {
    id: "student9@example.com",
    name: "Grace Lee",
    email: "student9@example.com",
    role: "student",
  },
  {
    id: "student10@example.com",
    name: "Henry Wilson",
    email: "student10@example.com",
    role: "student",
  },
  {
    id: "student11@example.com",
    name: "Ivy Chen",
    email: "student11@example.com",
    role: "student",
  },
  {
    id: "student12@example.com",
    name: "Jack Taylor",
    email: "student12@example.com",
    role: "student",
  },
  {
    id: "student13@example.com",
    name: "Sarah Martinez",
    email: "student13@example.com",
    role: "student",
  },
  {
    id: "student14@example.com",
    name: "Michael Anderson",
    email: "student14@example.com",
    role: "student",
  },
  {
    id: "student15@example.com",
    name: "Emma Thompson",
    email: "student15@example.com",
    role: "student",
  },
];

// Initialize dummy data (assessments, enrollments, compliance)
const initializeDummyData = () => {
  try {
    // Check if already initialized
    if (localStorage.getItem(LS_KEY_DUMMY_INIT) === "true") {
      return;
    }

    const assessments = {};
    const now = new Date();

    // Course enrollments:
    // Students 1-5: 1 course
    // Students 6-10: 2 courses
    // Students 11-15: 3 courses

    // Student 1: 1 course (Course 1) - Grade A, Compliant
    assessments["student1@example.com"] = {
      1: [
        {
          id: 1,
          score: 85,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 90,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 2: 1 course (Course 1) - Grade B, Compliant
    assessments["student2@example.com"] = {
      1: [
        {
          id: 1,
          score: 65,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 70,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 3: 1 course (Course 1) - Grade C, Non-Compliant (missed due date)
    assessments["student3@example.com"] = {
      1: [
        {
          id: 1,
          score: 45,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 40,
          completed: false,
          dueDate: new Date(
            now.getTime() - 10 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }, // Past due, not completed
      ],
    };

    // Student 4: 1 course (Course 2) - Grade A, Compliant
    assessments["student4@example.com"] = {
      2: [
        {
          id: 1,
          score: 88,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 92,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 5: 1 course (Course 3) - Grade B, Compliant
    assessments["student5@example.com"] = {
      3: [
        {
          id: 1,
          score: 72,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 68,
          completed: true,
          dueDate: new Date(
            now.getTime() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 6: 2 courses (Course 1, Course 2) - Grade A & B, Compliant
    assessments["student6@example.com"] = {
      1: [
        {
          id: 1,
          score: 82,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 85,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      2: [
        {
          id: 1,
          score: 68,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 72,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 7: 2 courses (Course 1, Course 2) - Grade B & C, Compliant
    assessments["student7@example.com"] = {
      1: [
        {
          id: 1,
          score: 75,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 78,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      2: [
        {
          id: 1,
          score: 55,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 48,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 8: 2 courses (Course 1, Course 3) - Grade C & B, Non-Compliant
    assessments["student8@example.com"] = {
      1: [
        {
          id: 1,
          score: 42,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 45,
          completed: false,
          dueDate: new Date(
            now.getTime() - 8 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }, // Past due
      ],
      3: [
        {
          id: 1,
          score: 65,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 70,
          completed: true,
          dueDate: new Date(
            now.getTime() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 9: 2 courses (Course 2, Course 3) - Grade A & A, Compliant
    assessments["student9@example.com"] = {
      2: [
        {
          id: 1,
          score: 90,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 88,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      3: [
        {
          id: 1,
          score: 85,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 92,
          completed: true,
          dueDate: new Date(
            now.getTime() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 10: 2 courses (Course 1, Course 3) - Grade C & C, Non-Compliant
    assessments["student10@example.com"] = {
      1: [
        {
          id: 1,
          score: 48,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 42,
          completed: false,
          dueDate: new Date(
            now.getTime() - 9 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }, // Past due
      ],
      3: [
        {
          id: 1,
          score: 45,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 40,
          completed: true,
          dueDate: new Date(
            now.getTime() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 11: 3 courses (Course 1, Course 2, Course 3) - Grade A, B, C, Compliant
    assessments["student11@example.com"] = {
      1: [
        {
          id: 1,
          score: 88,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 85,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      2: [
        {
          id: 1,
          score: 72,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 68,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      3: [
        {
          id: 1,
          score: 52,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 48,
          completed: true,
          dueDate: new Date(
            now.getTime() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 12: 3 courses (Course 1, Course 2, Course 3) - Grade B, A, B, Compliant
    assessments["student12@example.com"] = {
      1: [
        {
          id: 1,
          score: 75,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 78,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      2: [
        {
          id: 1,
          score: 82,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 85,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      3: [
        {
          id: 1,
          score: 70,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 72,
          completed: true,
          dueDate: new Date(
            now.getTime() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 13: 3 courses (Course 1, Course 2, Course 3) - Grade C, C, C, Non-Compliant
    assessments["student13@example.com"] = {
      1: [
        {
          id: 1,
          score: 45,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 42,
          completed: false,
          dueDate: new Date(
            now.getTime() - 9 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }, // Past due
      ],
      2: [
        {
          id: 1,
          score: 48,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 50,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      3: [
        {
          id: 1,
          score: 40,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 38,
          completed: false,
          dueDate: new Date(
            now.getTime() - 8 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }, // Past due
      ],
    };

    // Student 14: 3 courses (Course 1, Course 2, Course 3) - Grade A, A, A, Compliant
    assessments["student14@example.com"] = {
      1: [
        {
          id: 1,
          score: 95,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 92,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      2: [
        {
          id: 1,
          score: 88,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 90,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      3: [
        {
          id: 1,
          score: 85,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 88,
          completed: true,
          dueDate: new Date(
            now.getTime() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Student 15: 3 courses (Course 1, Course 2, Course 3) - Grade B, C, A, Compliant
    assessments["student15@example.com"] = {
      1: [
        {
          id: 1,
          score: 70,
          completed: true,
          dueDate: new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 75,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      2: [
        {
          id: 1,
          score: 48,
          completed: true,
          dueDate: new Date(
            now.getTime() - 6 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 52,
          completed: true,
          dueDate: new Date(
            now.getTime() - 4 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
      3: [
        {
          id: 1,
          score: 85,
          completed: true,
          dueDate: new Date(
            now.getTime() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          score: 90,
          completed: true,
          dueDate: new Date(
            now.getTime() - 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    // Save assessments
    localStorage.setItem(LS_KEY_ASSESSMENTS, JSON.stringify(assessments));

    // Initialize attendance data for some students with DATES
    const attendanceData = {};

    // Student 1: Attended all sessions
    attendanceData["student1@example.com"] = {
      "ls-101": { enrolled: true, attended: true, date: "2026-01-10" },
      "ls-102": { enrolled: true, attended: true, date: "2026-01-12" },
    };

    // Student 4: Enrolled but did not attend
    attendanceData["student4@example.com"] = {
      "ls-101": { enrolled: true, attended: false, date: null },
      "ls-102": { enrolled: true, attended: false, date: null },
    };

    // Student 6: Mixed attendance
    attendanceData["student6@example.com"] = {
      "ls-101": { enrolled: true, attended: true, date: "2026-01-10" },
      "ls-102": { enrolled: true, attended: false, date: null },
    };

    // Student 9: Full attendance
    attendanceData["student9@example.com"] = {
      "ls-101": { enrolled: true, attended: true, date: "2026-01-10" },
      "ls-102": { enrolled: true, attended: true, date: "2026-01-12" },
      "ls-103": { enrolled: true, attended: true, date: "2026-01-14" },
    };

    // Student 11: Partial attendance
    attendanceData["student11@example.com"] = {
      "ls-101": { enrolled: true, attended: false, date: null },
      "ls-102": { enrolled: true, attended: true, date: "2026-01-12" },
    };

    // Student 14: Full attendance
    attendanceData["student14@example.com"] = {
      "ls-101": { enrolled: true, attended: true, date: "2026-01-10" },
      "ls-102": { enrolled: true, attended: true, date: "2026-01-12" },
      "ls-103": { enrolled: true, attended: true, date: "2026-01-14" },
    };

    // Save attendance data
    localStorage.setItem(LS_KEY_ATTENDANCE, JSON.stringify(attendanceData));

    // Initialize enrollments for dummy students
    // Students 1-5: 1 course
    // Students 6-10: 2 courses
    // Students 11-15: 3 courses
    const enrollments = [];

    // Students 1-3: Course 1
    enrollments.push({
      id: 1,
      title: "React Basics",
      level: "beginner",
      lessons: 120,
      thumbnail: "",
    });
    enrollments.push({
      id: 1,
      title: "React Basics",
      level: "beginner",
      lessons: 120,
      thumbnail: "",
    });
    enrollments.push({
      id: 1,
      title: "React Basics",
      level: "beginner",
      lessons: 120,
      thumbnail: "",
    });

    // Student 4: Course 2
    enrollments.push({
      id: 2,
      title: "JavaScript Deep Dive",
      level: "intermediate",
      lessons: 80,
      thumbnail: "",
    });

    // Student 5: Course 3
    enrollments.push({
      id: 3,
      title: ".NET Fundamentals",
      level: "beginner",
      lessons: 45,
      thumbnail: "",
    });

    // Students 6-7: Course 1 & 2
    enrollments.push({
      id: 1,
      title: "React Basics",
      level: "beginner",
      lessons: 120,
      thumbnail: "",
    });
    enrollments.push({
      id: 2,
      title: "JavaScript Deep Dive",
      level: "intermediate",
      lessons: 80,
      thumbnail: "",
    });
    enrollments.push({
      id: 1,
      title: "React Basics",
      level: "beginner",
      lessons: 120,
      thumbnail: "",
    });
    enrollments.push({
      id: 2,
      title: "JavaScript Deep Dive",
      level: "intermediate",
      lessons: 80,
      thumbnail: "",
    });

    // Students 8-9: Mixed courses (Course 1 & 3, Course 2 & 3)
    enrollments.push({
      id: 1,
      title: "React Basics",
      level: "beginner",
      lessons: 120,
      thumbnail: "",
    });
    enrollments.push({
      id: 3,
      title: ".NET Fundamentals",
      level: "beginner",
      lessons: 45,
      thumbnail: "",
    });
    enrollments.push({
      id: 2,
      title: "JavaScript Deep Dive",
      level: "intermediate",
      lessons: 80,
      thumbnail: "",
    });
    enrollments.push({
      id: 3,
      title: ".NET Fundamentals",
      level: "beginner",
      lessons: 45,
      thumbnail: "",
    });

    // Student 10: Course 1 & 3
    enrollments.push({
      id: 1,
      title: "React Basics",
      level: "beginner",
      lessons: 120,
      thumbnail: "",
    });
    enrollments.push({
      id: 3,
      title: ".NET Fundamentals",
      level: "beginner",
      lessons: 45,
      thumbnail: "",
    });

    // Students 11-15: All 3 courses
    for (let i = 0; i < 5; i++) {
      enrollments.push({
        id: 1,
        title: "React Basics",
        level: "beginner",
        lessons: 120,
        thumbnail: "",
      });
      enrollments.push({
        id: 2,
        title: "JavaScript Deep Dive",
        level: "intermediate",
        lessons: 80,
        thumbnail: "",
      });
      enrollments.push({
        id: 3,
        title: ".NET Fundamentals",
        level: "beginner",
        lessons: 45,
        thumbnail: "",
      });
    }

    // Save enrollments (merge with existing if any)
    try {
      const existing = JSON.parse(
        localStorage.getItem("learnsphere_enrollments") || "[]",
      );
      const existingIds = new Set(existing.map((e) => `${e.id}-${e.title}`));
      const newEnrollments = enrollments.filter(
        (e) => !existingIds.has(`${e.id}-${e.title}`),
      );
      localStorage.setItem(
        "learnsphere_enrollments",
        JSON.stringify([...existing, ...newEnrollments]),
      );
    } catch {
      localStorage.setItem(
        "learnsphere_enrollments",
        JSON.stringify(enrollments),
      );
    }

    // Mark as initialized
    localStorage.setItem(LS_KEY_DUMMY_INIT, "true");
  } catch (error) {
    console.error("Error initializing dummy data:", error);
  }
};

// Get all registered users from localStorage
// Returns ONLY students - instructors/admins are excluded
const getAllUsers = () => {
  // Initialize dummy data on first call
  initializeDummyData();

  const users = [];
  const userSet = new Set();

  // Add dummy students (ONLY students, NO instructors)
  DUMMY_STUDENTS.forEach((student) => {
    if (!userSet.has(student.email)) {
      users.push(student);
      userSet.add(student.email);
    }
  });

  try {
    // Get current user (if they are a student)
    const currentUser = JSON.parse(
      localStorage.getItem("learnsphere_user") || "null",
    );
    if (currentUser && currentUser.email && !userSet.has(currentUser.email)) {
      // Only add if they are a student, NOT an instructor/admin
      if (currentUser.role === "student" || !currentUser.role) {
        users.push({
          id: currentUser.email,
          name: currentUser.name || "Student",
          email: currentUser.email,
          role: "student",
        });
        userSet.add(currentUser.email);
      }
    }
  } catch {}

  return users;
};

// Get attendance data
const getAttendance = () => {
  try {
    const stored = localStorage.getItem(LS_KEY_ATTENDANCE);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Get assessment data
const getAssessments = () => {
  try {
    const stored = localStorage.getItem(LS_KEY_ASSESSMENTS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Get progress data
const getProgress = () => {
  try {
    const stored = localStorage.getItem(LS_KEY_PROGRESS);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Calculate grade from score
export const calculateGrade = (score) => {
  if (score >= 80) return "A";
  if (score >= 50) return "B";
  return "C";
};

// Get live sessions (from DashboardPage or can be extended)
export const getLiveSessions = () => {
  return [
    {
      id: "ls-101",
      title: "Intro to DSA – Live",
      courseId: 1,
      startTime: "2025-12-20T18:00:00+05:30",
    },
    {
      id: "ls-102",
      title: "System Design: Caching & Queues",
      courseId: 1,
      startTime: "2025-12-22T19:30:00+05:30",
    },
    {
      id: "ls-103",
      title: "Frontend Deep Dive: Performance",
      courseId: 2,
      startTime: "2025-12-25T17:00:00+05:30",
    },
  ];
};

// Check if course is Live type (can be extended to check course.type field)
const isLiveCourse = (courseId) => {
  // For now, check if course title contains "Live" or check course type
  // This can be extended when course.type field is added
  const liveSessions = getLiveSessions();
  return liveSessions.some((session) => session.courseId === courseId);
};

// Get course type (Self-Paced or Live)
export const getCourseType = (course) => {
  // If course has type field, use it
  if (course.type) return course.type;
  // Otherwise, check if it has live sessions
  return isLiveCourse(course.id) ? "Live" : "Self-Paced";
};

// Check compliance based on due date
const checkCompliance = (studentId, courseId, assessments) => {
  const studentAssessments = assessments[studentId] || {};
  const courseAssessments = studentAssessments[courseId] || [];

  if (courseAssessments.length === 0) return "Compliant"; // No assessments = compliant

  // Check if any assessment is past due date and not completed
  const now = new Date();
  for (const assessment of courseAssessments) {
    if (assessment.dueDate) {
      const dueDate = new Date(assessment.dueDate);
      if (dueDate < now && !assessment.completed) {
        return "Non-Compliant";
      }
    }
  }

  return "Compliant";
};

// Get student performance data
export const getStudentPerformance = async (courseId = null) => {
  const users = getAllUsers();
  const enrollments = getEnrollments();
  const assessments = getAssessments();
  const attendance = getAttendance();
  const courses = await getAllCourses();
  const liveSessions = getLiveSessions();

  // Filter to only students
  const students = users.filter((u) => u.role === "student" || !u.role);

  // If no students, create a default one from current user
  if (students.length === 0) {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("learnsphere_user") || "null",
      );
      if (currentUser) {
        students.push({
          id: currentUser.email || "student@example.com",
          name: currentUser.name || "Student",
          email: currentUser.email || "student@example.com",
          role: "student",
        });
      }
    } catch {}
  }

  // Group data by student
  const studentMap = new Map();

  students.forEach((student) => {
    const studentAssessments = assessments[student.id] || {};
    const studentAttendance = attendance[student.id] || {};
    const studentCourses = [];
    let totalScore = 0;
    let totalCourses = 0;
    let hasNonCompliant = false;
    let hasAttended = false;
    let hasAttendanceData = false;
    let overallStatus = "Not Enrolled";

    // Find all courses this student is enrolled in
    Object.keys(studentAssessments).forEach((courseIdKey) => {
      const course = courses.find((c) => c.id.toString() === courseIdKey);
      if (!course) return;

      // If filtering by courseId, skip courses that don't match
      if (courseId && course.id.toString() !== courseId.toString()) return;

      const courseAssessments = studentAssessments[course.id] || [];

      // Calculate score and grade for this course
      const scores = courseAssessments
        .filter((a) => a.completed)
        .map((a) => a.score || 0);
      const avgScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null;
      const grade = avgScore !== null ? calculateGrade(avgScore) : null;

      if (avgScore !== null) {
        totalScore += avgScore;
        totalCourses++;
      }

      // Get completion status for this course
      const totalAssessments = courseAssessments.length || 1;
      const completedAssessments = courseAssessments.filter(
        (a) => a.completed,
      ).length;
      const courseStatus =
        completedAssessments === totalAssessments && totalAssessments > 0
          ? "Completed"
          : completedAssessments > 0
            ? "In Progress"
            : "Enrolled";

      // Update overall status (In Progress > Enrolled > Completed)
      if (
        overallStatus === "Not Enrolled" ||
        (overallStatus === "Enrolled" && courseStatus === "In Progress") ||
        (overallStatus === "Completed" && courseStatus === "In Progress")
      ) {
        overallStatus = courseStatus;
      } else if (
        overallStatus === "Not Enrolled" &&
        courseStatus === "Enrolled"
      ) {
        overallStatus = "Enrolled";
      }

      // Check compliance for this course
      const compliance = checkCompliance(student.id, course.id, assessments);
      if (compliance === "Non-Compliant") {
        hasNonCompliant = true;
      }

      // Check attendance for live courses
      const courseType = getCourseType(course);
      if (courseType === "Live") {
        const courseLiveSessions = liveSessions.filter(
          (s) => s.courseId === course.id,
        );

        if (courseLiveSessions.length > 0) {
          courseLiveSessions.forEach((session) => {
            if (studentAttendance[session.id]?.enrolled) {
              hasAttendanceData = true;
              if (studentAttendance[session.id]?.attended) {
                hasAttended = true;
              }
            }
          });
        }
      }

      studentCourses.push({
        title: course.title,
        grade,
        score: avgScore,
      });
    });

    // Calculate overall grade
    const overallScore =
      totalCourses > 0 ? Math.round(totalScore / totalCourses) : null;
    const overallGrade =
      overallScore !== null ? calculateGrade(overallScore) : null;

    // Collect attendance dates
    const attendanceDates = [];
    if (hasAttendanceData) {
      Object.keys(studentAttendance).forEach((sessionId) => {
        const sessionData = studentAttendance[sessionId];
        if (sessionData.enrolled && sessionData.attended && sessionData.date) {
          attendanceDates.push(sessionData.date);
        }
      });
    }

    // Format attendance display with dates
    let attendanceDisplay = "NA";
    if (hasAttendanceData) {
      if (attendanceDates.length > 0) {
        // Show dates in a readable format
        attendanceDisplay = attendanceDates.join(", ");
      } else {
        attendanceDisplay = "Not Attended";
      }
    }

    // Create courses list string
    const coursesEnrolled =
      studentCourses.length > 0
        ? studentCourses.map((c) => c.title).join(", ")
        : "N/A";

    // Only add student if they have courses or if not filtering by courseId
    if (studentCourses.length > 0 || !courseId) {
      studentMap.set(student.id, {
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        coursesEnrolled,
        courses: studentCourses,
        grade: overallGrade,
        score: overallScore,
        status: overallStatus,
        compliance: hasNonCompliant
          ? "Non-Compliant"
          : studentCourses.length > 0
            ? "Compliant"
            : "N/A",
        attendance: attendanceDisplay, // Now shows dates like "2026-01-10, 2026-01-12"
      });
    }
  });

  return Array.from(studentMap.values());
};

// Get course performance data
export const getCoursePerformance = async () => {
  const courses = await getAllCourses();
  const enrollments = getEnrollments();
  const assessments = getAssessments();
  const attendance = getAttendance();
  const liveSessions = getLiveSessions();
  const users = getAllUsers();
  const students = users.filter((u) => u.role === "student" || !u.role);

  return courses.map((course) => {
    const courseType = getCourseType(course);

    // Find enrollments for this course
    const courseEnrollments = enrollments.filter(
      (e) => e.id?.toString() === course.id.toString(),
    );

    // Get student performance for this course
    const studentPerformances = [];

    // For each student, check if they have assessments for this course
    students.forEach((student) => {
      const studentAssessments = assessments[student.id] || {};
      const courseAssessments = studentAssessments[course.id] || [];

      // Only include if student has assessments (indicating enrollment)
      if (courseAssessments.length > 0) {
        const scores = courseAssessments
          .filter((a) => a.completed)
          .map((a) => a.score || 0);
        const avgScore =
          scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : 0;
        const grade = avgScore > 0 ? calculateGrade(avgScore) : null;

        studentPerformances.push({
          studentId: student.id,
          grade,
          score: avgScore,
        });
      }
    });

    // Calculate pass/fail
    const passed = studentPerformances.filter(
      (p) => p.grade === "A" || p.grade === "B",
    ).length;
    const failed = studentPerformances.filter((p) => p.grade === "C").length;

    // Get attendance stats for live courses
    let attendanceStats = null;
    if (courseType === "Live") {
      const courseLiveSessions = liveSessions.filter(
        (s) => s.courseId === course.id,
      );

      let totalEnrolled = 0;
      let totalAttended = 0;

      courseLiveSessions.forEach((session) => {
        students.forEach((student) => {
          const studentAttendance = attendance[student.id] || {};
          if (studentAttendance[session.id]?.enrolled) {
            totalEnrolled++;
            if (studentAttendance[session.id]?.attended) {
              totalAttended++;
            }
          }
        });
      });

      attendanceStats = {
        enrolled: totalEnrolled,
        attended: totalAttended,
        notAttended: totalEnrolled - totalAttended,
      };
    }

    return {
      ...course,
      type: courseType,
      enrolled: courseEnrollments.length,
      passed,
      failed,
      attendanceStats,
    };
  });
};

// Get summary statistics
export const getSummaryStats = async () => {
  const courses = await getAllCourses();
  const enrollments = getEnrollments();
  const assessments = getAssessments();
  const users = getAllUsers();
  const students = users.filter((u) => u.role === "student" || !u.role);

  // Count total enrolled
  const enrolledSet = new Set();
  enrollments.forEach((enrollment) => {
    // Count unique students enrolled
    enrolledSet.add(enrollment.id);
  });

  // Calculate pass/fail
  let totalPassed = 0;
  let totalFailed = 0;

  students.forEach((student) => {
    const studentAssessments = assessments[student.id] || {};
    const allScores = Object.values(studentAssessments)
      .flat()
      .filter((a) => a.completed)
      .map((a) => a.score || 0)
      .filter((s) => s > 0);

    if (allScores.length > 0) {
      const avg = allScores.reduce((a, b) => a + b, 0) / allScores.length;
      const grade = calculateGrade(avg);
      if (grade === "A" || grade === "B") totalPassed++;
      else totalFailed++;
    }
  });

  return {
    totalCourses: courses.length,
    totalEnrolled: enrolledSet.size,
    totalPassed,
    totalFailed,
    totalStudents: students.length,
  };
};

// Mark attendance for a live session
export const markAttendance = (studentId, sessionId, attended) => {
  const attendance = getAttendance();
  if (!attendance[studentId]) {
    attendance[studentId] = {};
  }
  if (!attendance[studentId][sessionId]) {
    attendance[studentId][sessionId] = { enrolled: true, attended: false };
  }
  attendance[studentId][sessionId].attended = attended;
  localStorage.setItem(LS_KEY_ATTENDANCE, JSON.stringify(attendance));
};

// Enroll student in live session
export const enrollInLiveSession = (studentId, sessionId) => {
  const attendance = getAttendance();
  if (!attendance[studentId]) {
    attendance[studentId] = {};
  }
  attendance[studentId][sessionId] = { enrolled: true, attended: false };
  localStorage.setItem(LS_KEY_ATTENDANCE, JSON.stringify(attendance));
};

// Add assessment (for manual addition)
export const addAssessment = (studentId, courseId, assessment) => {
  const assessments = getAssessments();
  if (!assessments[studentId]) {
    assessments[studentId] = {};
  }
  if (!assessments[studentId][courseId]) {
    assessments[studentId][courseId] = [];
  }
  assessments[studentId][courseId].push({
    id: Date.now(),
    ...assessment,
    completed: assessment.completed || false,
  });
  localStorage.setItem(LS_KEY_ASSESSMENTS, JSON.stringify(assessments));
};
