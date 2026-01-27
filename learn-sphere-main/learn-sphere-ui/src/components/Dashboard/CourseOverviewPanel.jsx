// src/components/CourseoverviewPanel/CourseOverviewPanel.jsx
import React, { useState } from "react";
import CourseList from "./CourseList";

const CourseOverviewPanel = ({ allCourses, enrolledCourses }) => {
  const [showOverview, setShowOverview] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showEnrolledCourses, setShowEnrolledCourses] = useState(false);

  return (
    <div className="course-overview-panel">
      {/* Top-level accordion */}
      <button
        onClick={() => setShowOverview(!showOverview)}
        className="w-full text-left px-4 py-2 rounded bg-[var(--card)] border border-[var(--border)] font-semibold hover:brightness-110 transition"
      >
        {showOverview ? "▼" : "▶"} Course Overview
      </button>

      {/* Expand content */}
      {showOverview && (
        <div className="mt-3 space-y-4 pl-4">
          {/* Sub-ladder: All Courses */}
          <div>
            <button
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="w-full text-left px-3 py-2 rounded bg-[var(--card)] border border-[var(--border)] font-semibold hover:brightness-110 transition"
            >
              {showAllCourses ? "▼" : "▶"} All Available Courses
            </button>
            {showAllCourses && (
              <div className="mt-2 pl-4">
                <CourseList courses={allCourses} isEnrolled={false} />
              </div>
            )}
          </div>

          {/* Sub-ladder: Enrolled Courses */}
          <div>
            <button
              onClick={() => setShowEnrolledCourses(!showEnrolledCourses)}
              className="w-full text-left px-3 py-2 rounded bg-[var(--card)] border border-[var(--border)] font-semibold hover:brightness-110 transition"
            >
              {showEnrolledCourses ? "▼" : "▶"} My Enrolled Courses
            </button>
            {showEnrolledCourses && (
              <div className="mt-2 pl-4">
                <CourseList courses={enrolledCourses} isEnrolled={true} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseOverviewPanel;
