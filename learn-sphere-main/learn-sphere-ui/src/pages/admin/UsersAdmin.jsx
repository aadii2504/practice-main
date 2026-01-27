
// src/pages/admin/UsersAdmin.jsx
import React, { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

const LS_KEY = "learnsphere_users";

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
    <div className="text-sm text-[var(--text)]/80">{label}</div>
    <div className="mt-2 text-2xl font-bold">{value}</div>
  </div>
);
export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const seedIfEmpty = () => {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) {
        const seed = [
          {
            id: "u-1001",
            name: "Aarav Sharma",
            email: "aarav.sharma@example.com",
            phone: "9876543210",
            role: "student",
            status: "active",
            guardian: { name: "Rohit Sharma", phone: "9876500001" },
            createdAt: "2025-12-01T09:15:00Z",
          },
          {
            id: "u-1002",
            name: "Ananya Iyer",
            email: "ananya.iyer@example.com",
            phone: "9876543211",
            role: "student",
            status: "active",
            guardian: { name: "Lakshmi Iyer", phone: "9876500002" },
            createdAt: "2025-12-02T11:30:00Z",
          },
          {
            id: "u-1003",
            name: "Rohan Gupta",
            email: "rohan.gupta@example.com",
            phone: "9876543212",
            role: "student",
            status: "inactive",
            guardian: { name: "Sanjay Gupta", phone: "9876500003" },
            createdAt: "2025-12-03T14:00:00Z",
          },
          // {
          //   id: "u-1004",
          //   name: "Admin User",
          //   email: "admin@example.com",
          //   phone: "9876543213",
          //   role: "admin",
          //   status: "active",
          //   guardian: null,
          //   createdAt: "2025-12-04T10:20:00Z",
          // },
        ];
        localStorage.setItem(LS_KEY, JSON.stringify(seed));
      }
    };

    const loadUsers = () => {
      try {
        const data = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    seedIfEmpty();
    loadUsers();

    // Refresh list when registration fires userUpdated
    window.addEventListener("userUpdated", loadUsers);
    return () => window.removeEventListener("userUpdated", loadUsers);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let data = [...users];
    if (term) {
      data = data.filter((u) =>
        [u.name, u.email, u.phone, u.role, u.guardian?.name, u.guardian?.phone]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term))
      );
    }
    data.sort((a, b) => {
      const va = (a[sortBy] ?? "").toString().toLowerCase();
      const vb = (b[sortBy] ?? "").toString().toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [users, q, sortBy, sortDir]);

  const changeSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users</h1>
          {/* <div className="text-sm text-[var(--text)]/70">
            Manage registered users (local storage)
          </div> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Stat label="Total Users" value={users.length} />
          <Stat
            label="Students"
            value={users.filter((u) => u.role === "student").length}
          />
          {/* <Stat
            label="Admins"
            value={users.filter((u) => u.role === "admin").length}
          /> */}
        </div>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email, phone, guardian..."
              className="w-full rounded-md px-3 py-2 bg-[var(--card)] border border-[var(--border)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-[var(--text)]/70">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md px-3 py-2 bg-[var(--card)] border border-[var(--border)] text-sm"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="px-3 py-2 rounded-md border border-[var(--border)] text-sm"
            >
              {sortDir === "asc" ? "Asc" : "Desc"}
            </button>
          </div>
        </div>

        <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="min-w-full overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-black/20">
                <tr>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => changeSort("name")}
                  >
                    Name
                  </th>
                  <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => changeSort("email")}
                  >
                    Email
                  </th>
                  <th className="text-left px-4 py-3">Phone</th>
                  {/* <th
                    className="text-left px-4 py-3 cursor-pointer"
                    onClick={() => changeSort("role")}
                  >
                    Role
                  </th> */}
                  <th className="text-left px-4 py-3">Guardian</th>
                  <th className="text-left px-4 py-3">Guardian Phone</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-[var(--text)]/70"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr
                      key={u.id}
                      className="border-t border-[var(--border)] hover:bg-white/5"
                    >
                      <td className="px-4 py-3">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">{u.phone || "-"}</td>
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
                      <td className="px-4 py-3">{u.guardian?.name || "-"}</td>
                      <td className="px-4 py-3">{u.guardian?.phone || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap ${
                            u.status === "active"
                              ? "bg-green-600/20 text-green-300"
                              : "bg-gray-600/20 text-gray-300"
                          }`}
                        >
                          {u.status || "inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}



