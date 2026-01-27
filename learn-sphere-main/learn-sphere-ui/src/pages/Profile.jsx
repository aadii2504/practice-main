import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PersonalInfo } from "../components/profile/PersonalInfo";
import { PAcademic } from "../components/profile/PAcademic";
import { GuardianInfo } from "../components/profile/GuardianInfo";

export const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("Student");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("studentName");
    if (u) setName(u);
    setCourse(localStorage.getItem("studentCourse") || "—");
    setYear(localStorage.getItem("studentYear") || "—");
  }, []);

  const stats = [
    { label: "Course", value: course || "Not set" },
    { label: "Year", value: year || "Not set" },
    { label: "Enrolled", value: "2025-01-01" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text)]">{name}</h2>
          <p className="text-sm text-[var(--text)]/80">
            Student profile and details
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditMode((s) => !s)}
            className="px-3 py-2 rounded-md font-semibold bg-[var(--card)] border border-[var(--border)] text-[var(--text)]"
          >
            {editMode ? "Done" : "Edit Profile"}
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("learnsphere_user");
              localStorage.removeItem("studentName");
              // notify same-window listeners
              window.dispatchEvent(new Event("userUpdated"));
              navigate("/");
              window.location.reload();
            }}
            className="px-3 py-2 rounded-md font-semibold bg-red-600 text-white hover:brightness-110 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {!editMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="text-sm text-[var(--text)]/80">{s.label}</div>
              <div className="mt-2 font-semibold text-[var(--text)]">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {editMode ? (
        <div>
          <PersonalInfo />
          <PAcademic />
          <GuardianInfo />
        </div>
      ) : null}
    </div>
  );
};
