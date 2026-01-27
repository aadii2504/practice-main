import React, { useEffect, useState, useMemo } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import {
  getStudentPerformance,
  getCoursePerformance,
  getSummaryStats,
} from "../../components/admin/AnalyticsStore";
import { HiOutlineDownload } from "react-icons/hi";

const ITEMS_PER_PAGE = 10;

// Summary Stat Box Component
const StatBox = ({ label, value, subtitle }) => (
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
    <div className="text-sm text-[var(--text)]/70 mb-1">{label}</div>
    <div className="text-3xl font-bold text-[var(--text)] mb-1">{value}</div>
    {subtitle && (
      <div className="text-xs text-[var(--text)]/60">{subtitle}</div>
    )}
  </div>
);

// Tab Button Component
const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-semibold text-sm rounded-t-lg transition-colors ${
      active
        ? "bg-[var(--card)] border-t border-l border-r border-[var(--border)] text-[var(--text)]"
        : "text-[var(--text)]/60 hover:text-[var(--text)]/80 bg-transparent"
    }`}
  >
    {children}
  </button>
);

// Export to CSV function
const exportToCSV = (data, filename, headers) => {
  const csvHeaders = headers.map((h) => h.label).join(",");
  const csvRows = data.map((row) =>
    headers
      .map((h) => {
        const value = row[h.key] || "";
        // Escape commas and quotes in CSV
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(","),
  );

  const csvContent = [csvHeaders, ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("student"); // "student" or "course"
  const [loading, setLoading] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    totalCourses: 0,
    totalEnrolled: 0,
    totalPassed: 0,
    totalFailed: 0,
    totalStudents: 0,
  });
  const [studentData, setStudentData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [stats, students, courses] = await Promise.all([
          getSummaryStats(),
          getStudentPerformance(),
          getCoursePerformance(),
        ]);
        setSummaryStats(stats);
        setStudentData(students);
        setCourseData(courses);
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter and paginate student data
  const filteredStudentData = useMemo(() => {
    let filtered = studentData;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = studentData.filter(
        (item) =>
          item.studentName?.toLowerCase().includes(query) ||
          item.studentEmail?.toLowerCase().includes(query) ||
          item.courseTitle?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [studentData, searchQuery]);

  // Filter and paginate course data
  const filteredCourseData = useMemo(() => {
    let filtered = courseData;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = courseData.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.categories?.some((cat) => cat.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [courseData, searchQuery]);

  // Pagination calculations
  const currentData =
    activeTab === "student" ? filteredStudentData : filteredCourseData;
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = currentData.slice(startIndex, endIndex);

  // Reset to page 1 when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleExportCSV = () => {
    if (activeTab === "student") {
      const headers = [
        { key: "studentName", label: "Student Name" },
        { key: "coursesEnrolled", label: "Courses" },
        { key: "grade", label: "Grade" },
        { key: "score", label: "Score" },
        { key: "status", label: "Status" },
        { key: "compliance", label: "Compliance" },
        { key: "attendance", label: "Attendance Dates" },
      ];
      exportToCSV(filteredStudentData, "student-report.csv", headers);
    } else {
      const headers = [
        { key: "title", label: "Course Name" },
        { key: "type", label: "Type" },
        { key: "enrolled", label: "Total Enrolled" },
        { key: "passed", label: "Passed" },
        { key: "failed", label: "Failed" },
        { key: "attendanceStats", label: "Attendance (Enrolled/Attended)" },
      ];
      // Format course data for CSV
      const csvData = filteredCourseData.map((course) => ({
        ...course,
        attendanceStats: course.attendanceStats
          ? `${course.attendanceStats.enrolled}/${course.attendanceStats.attended}`
          : "N/A",
      }));
      exportToCSV(csvData, "course-report.csv", headers);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="text-[var(--text)]">Loading analytics...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">
            Learning Analytics & Reporting
          </h1>
          <p className="text-sm text-[var(--text)]/70">
            Track student performance, course metrics, and generate reports
          </p>
        </div>

        {/* Summary Stats Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatBox
            label="Total Courses"
            value={summaryStats.totalCourses}
            subtitle="Published courses"
          />
          <StatBox
            label="Total Enrolled"
            value={summaryStats.totalEnrolled}
            subtitle="Students enrolled"
          />
          <StatBox
            label="Passed"
            value={summaryStats.totalPassed}
            subtitle="Grade A or B"
          />
          <StatBox
            label="Failed"
            value={summaryStats.totalFailed}
            subtitle="Grade C"
          />
        </div>

        {/* Tabs and Search */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex border-b border-[var(--border)]">
            <TabButton
              active={activeTab === "student"}
              onClick={() => setActiveTab("student")}
            >
              Student Report
            </TabButton>
            <TabButton
              active={activeTab === "course"}
              onClick={() => setActiveTab("course")}
            >
              Course Report
            </TabButton>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text)] text-sm"
            />
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-sm font-semibold"
            >
              <HiOutlineDownload />
              Export CSV
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {activeTab === "student" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--card)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Student Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Courses
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Grade
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Compliance
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Attendance Dates
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-[var(--text)]/60"
                      >
                        No student data found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, idx) => (
                      <tr
                        key={`${item.studentId}-${item.courseId}-${idx}`}
                        className="border-b border-[var(--border)] hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-[var(--text)]">
                          {item.studentName}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]">
                          {item.coursesEnrolled}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.grade ? (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                                item.grade === "A"
                                  ? "bg-green-600/20 text-green-400"
                                  : item.grade === "B"
                                    ? "bg-blue-600/20 text-blue-400"
                                    : "bg-orange-600/20 text-orange-400"
                              }`}
                            >
                              {item.grade}
                            </span>
                          ) : (
                            <span className="text-[var(--text)]/40">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]/80">
                          {item.status}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.compliance === "Compliant" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-600/20 text-green-400">
                              Compliant
                            </span>
                          ) : item.compliance === "Non-Compliant" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400">
                              Non-Compliant
                            </span>
                          ) : (
                            <span className="text-[var(--text)]/40">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]/80">
                          {item.attendance !== "NA" &&
                          item.attendance !== "Not Attended" ? (
                            <span className="text-xs">{item.attendance}</span>
                          ) : item.attendance === "Not Attended" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400">
                              Not Attended
                            </span>
                          ) : (
                            <span className="text-[var(--text)]/40">NA</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--card)] border-b border-[var(--border)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Course Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Total Enrolled
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Passed
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Failed
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--text)]">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-[var(--text)]/60"
                      >
                        No course data found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((course) => (
                      <tr
                        key={course.id}
                        className="border-b border-[var(--border)] hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-[var(--text)]">
                          {course.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]/80">
                          {course.type}
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]">
                          {course.enrolled}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-600/20 text-green-400">
                            {course.passed}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-red-600/20 text-red-400">
                            {course.failed}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]/80">
                          {course.type === "Live" && course.attendanceStats ? (
                            <span>
                              {course.attendanceStats.attended} /{" "}
                              {course.attendanceStats.enrolled}
                            </span>
                          ) : (
                            <span className="text-[var(--text)]/40">NA</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="text-sm text-[var(--text)]/70">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, currentData.length)} of {currentData.length}{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--text)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-[var(--text)]/70">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-[var(--border)] bg-[var(--card)] text-[var(--text)] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
