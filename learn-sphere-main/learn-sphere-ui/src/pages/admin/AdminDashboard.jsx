
// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
    <div className="text-sm text-[var(--text)]/80">{label}</div>
    <div className="mt-2 text-2xl font-bold">{value}</div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, courses: 0 });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("learnsphere_users") || "[]");
    const courses = JSON.parse(localStorage.getItem("learnsphere_courses") || "[]");

    const studentCount = users.filter((u) => u.role === "student").length;
    setStats({ students: studentCount, courses: courses.length });

    const sortedUsers = [...users].sort((a, b) => {
      const da = new Date(a.createdAt || 0).getTime();
      const db = new Date(b.createdAt || 0).getTime();
      return db - da;
    });
    setRecentUsers(sortedUsers.slice(0, 5));
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-[var(--text)]/70">
            Overview of platform metrics
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Stat label="Students" value={stats.students} />
          <Stat label="Courses" value={stats.courses} />
        </div>

        {/* Quick Actions */}
        <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Manage Users
            </Link>
            <Link
              to="/admin/courses"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Manage Courses
            </Link>
            <Link
              to="/admin/profile"
              className="px-4 py-2 rounded-md border border-[var(--border)] hover:bg-white/10 transition"
            >
              Admin Profile
            </Link>
          </div>
        </section>

        {/* Recent Activity - Users */}
        <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Link
              to="/admin/users"
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              View all
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-[var(--text)]/80">No recent activity (placeholder).</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/20">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Email</th>
                    {/* <th className="text-left px-4 py-3">Role</th> */}
                    <th className="text-left px-4 py-3">Guardian</th>
                    <th className="text-left px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-[var(--border)] hover:bg-white/5"
                    >
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      {/* <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                            u.role === "admin"
                              ? "bg-indigo-600/20 text-indigo-300"
                              : "bg-green-600/20 text-green-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td> */}
                      <td className="px-4 py-3">
                        {u.guardian?.name
                          ? `${u.guardian.name} (${u.guardian.phone || "-"})`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
