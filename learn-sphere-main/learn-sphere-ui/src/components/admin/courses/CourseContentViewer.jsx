// components/admin/courses/CourseContentViewer.jsx
import React from "react";

export default function CourseContentViewer({ course, onClose }) {
  const [activeTab, setActiveTab] = React.useState("details");

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/80">
          <div>
            <h2 className="text-2xl font-bold text-white">{course.title}</h2>
            <p className="text-sm text-slate-300 mt-1">{course.summary}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-600/20 hover:text-red-400 rounded-md transition text-slate-400"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-800 border-b border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-none ${
              activeTab === "details"
                ? "text-blue-400 border-b-2 border-blue-500 bg-slate-800"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            📚 Course Details
          </button>
          <button
            onClick={() => setActiveTab("assessment")}
            className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-none ${
              activeTab === "assessment"
                ? "text-blue-400 border-b-2 border-blue-500 bg-slate-800"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            📋 Assessment
          </button>
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`px-6 py-3 text-sm font-semibold whitespace-nowrap transition-none ${
              activeTab === "quizzes"
                ? "text-blue-400 border-b-2 border-blue-500 bg-slate-800"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            ❓ Quizzes
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Course Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Level</p>
                  <p className="text-lg font-semibold mt-1 capitalize text-slate-100">{course.level}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Duration</p>
                  <p className="text-lg font-semibold mt-1 text-slate-100">{course.duration}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
                  <p className={`text-lg font-semibold mt-1 capitalize ${
                    course.status === "published" ? "text-green-400" :
                    course.status === "draft" ? "text-yellow-400" : "text-gray-400"
                  }`}>{course.status}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Price</p>
                  <p className="text-lg font-semibold mt-1 text-slate-100">{course.price === 0 ? "Free" : `$${course.price}`}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Students</p>
                  <p className="text-lg font-semibold mt-1 text-slate-100">{course.students}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Slug</p>
                  <p className="text-sm font-mono mt-1 truncate text-slate-100">{course.slug}</p>
                </div>
              </div>

              {/* Categories */}
              {course.categories?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.categories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-600 border border-blue-500 rounded-full text-sm text-blue-100">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Thumbnail */}
              {course.thumbnail && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">Thumbnail</h3>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full max-h-64 object-cover rounded-lg border border-slate-700"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">Description</h3>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm text-slate-200 whitespace-pre-wrap font-mono text-xs max-h-48 overflow-y-auto">
                  {course.description || "No description provided"}
                </div>
              </div>
            </div>
          )}

          {activeTab === "assessment" && (
            <div className="space-y-4">
              {course.assessment && Object.keys(course.assessment).length > 0 ? (
                <>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 uppercase tracking-wide">Assessment Title</p>
                    <p className="text-lg font-semibold mt-1 text-slate-100">{course.assessment.title || "Untitled Assessment"}</p>
                  </div>

                  {course.assessment.description && (
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm text-slate-400 uppercase tracking-wide mb-2">Description</p>
                      <p className="text-sm text-slate-200">{course.assessment.description}</p>
                    </div>
                  )}

                  {course.assessment.questions?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-100">
                        <span className="text-xl">📝</span>
                        Questions ({course.assessment.questions.length})
                      </h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {course.assessment.questions.map((q, idx) => (
                          <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <p className="font-semibold text-sm mb-2 text-slate-100">
                              Q{idx + 1}: {q.question || "Untitled Question"}
                            </p>
                            {q.options?.length > 0 && (
                              <ul className="space-y-1 ml-4 text-sm text-slate-200">
                                {q.options.map((opt, optIdx) => (
                                  <li key={optIdx} className="flex items-center gap-2">
                                    <span className="text-slate-500">•</span>
                                    <span className={opt === q.correctAnswer ? "text-green-400 font-semibold" : ""}>
                                      {opt}
                                      {opt === q.correctAnswer && " ✓"}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-lg">No assessment created yet</p>
                  <p className="text-slate-500 text-sm mt-1">Create an assessment in the edit view</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "quizzes" && (
            <div className="space-y-4">
              {course.quiz && course.quiz.questions?.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm text-slate-400 uppercase tracking-wide">Time Limit</p>
                      <p className="text-lg font-semibold mt-1 text-slate-100">{course.quiz.timeLimit} mins</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <p className="text-sm text-slate-400 uppercase tracking-wide">Passing Score</p>
                      <p className="text-lg font-semibold mt-1 text-slate-100">{course.quiz.passingScore}%</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-100">
                    <span className="text-xl">❓</span>
                    Questions ({course.quiz.questions.length})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {course.quiz.questions.map((q, idx) => (
                      <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <p className="font-semibold text-sm mb-2 text-slate-100">
                          Q{idx + 1}: {q.question || "Untitled Question"}
                        </p>
                        {q.options?.length > 0 && (
                          <ul className="space-y-1 ml-4 text-sm text-slate-200">
                            {q.options.map((opt, optIdx) => (
                              <li key={optIdx} className="flex items-center gap-2">
                                <span className="text-slate-500">•</span>
                                <span className={opt === q.correctAnswer ? "text-green-400 font-semibold" : ""}>
                                  {opt}
                                  {opt === q.correctAnswer && " ✓"}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-lg">No quizzes created yet</p>
                  <p className="text-slate-500 text-sm mt-1">Create quizzes in the edit view</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border)] p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
