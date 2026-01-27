
import React, { useState } from "react";
import CourseDetails from "./CourseDetails.jsx";
import ProgressBar from "./ProgressBar.jsx"
const CourseList = ({ title, courses, isEnrolled }) => {
  const [openCourseId, setOpenCourseId] = useState(null);

  const toggleCourse = (id) => {
    setOpenCourseId(openCourseId === id ? null : id);
  };

  return (
    <div className="course-list">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-4">
        {courses.map((course) => (
          <li
            key={course.id}
            className="course-item border border-[var(--border)] rounded-lg p-3 bg-[var(--card)]"
          >
            {/* Course header (ladder toggle) */}
            <button
              onClick={() => toggleCourse(course.id)}
              className="w-full text-left font-semibold text-[var(--text)] hover:brightness-110 transition"
            >
              {openCourseId === course.id ? "▼" : "▶"} {course.title}
              <ProgressBar percentage={course.progress || 0} />
              
            </button>

            {/* Expanded details */}
            {openCourseId === course.id && (
              <div className="mt-2 pl-4 space-y-2">
                <p className="text-[var(--text)]/80">{course.instructor}</p>
                <CourseDetails course={course} isEnrolled={isEnrolled} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;




