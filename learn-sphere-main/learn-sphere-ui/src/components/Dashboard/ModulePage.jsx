// src/components/CourseoverviewPanel/ModulePage.jsx
import React from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import ProgressBar from "./ProgressBar.jsx"; 

const ModulePage = () => {
  const { moduleId } = useParams();
  const location = useLocation();
  
  // Retrieve the course data passed through the Link state
  const currentCourse = location.state?.courseData;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-[var(--card)] p-6 rounded-xl border border-[var(--border)] mb-8 shadow-sm">
        <div>
          <Link to="/dashboard" className="text-sm text-blue-500 hover:underline">
            ← Back to Dashboard
          </Link>
          <h2 className="text-2xl font-bold mt-2">
            {currentCourse ? currentCourse.title : "Course Content"}
          </h2>
          <p className="text-gray-500 italic">Module {moduleId}</p>
        </div>

        {/* The Progress Bar now gets its data from the Link state! */}
        {currentCourse && (
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">
              Overall Progress
            </p>
            <ProgressBar percentage={currentCourse.progress || 0} />
          </div>
        )}
      </div>

      <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
        <p className="text-gray-400 font-medium">Video Content for Module {moduleId}</p>
      </div>
    </div>
  );
};

export default ModulePage;