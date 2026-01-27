import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { getUserByEmail, updateUser } from "../../components/registration/Api";
// import { normalizeEmail } from "../../components/registration/Validation";
// import { InputField } from "../../components/registration/InputField";

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const me = JSON.parse(localStorage.getItem("learnsphere_user") || "null");
      if (me?.email) {
        const stored = await getUserByEmail(me.email);
        setForm({
          name: stored?.name || me.name || "",
          email: stored?.email || me.email || "",
          password: "",
        });
      }
      setLoading(false);
    };
    init();
  }, []);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSave = async (e) => {
    e.preventDefault();
    setMessage("");
    const normalized = normalizeEmail(form.email);
    const updates = { name: form.name };
    if (form.password) updates.password = form.password; // only update if provided

    const updated = await updateUser(normalized, updates);
    if (!updated) {
      setMessage("Failed to update profile.");
      return;
    }

    // Update localStorage user as well
    const local =
      JSON.parse(localStorage.getItem("learnsphere_user") || "null") || {};
    local.name = updated.name;
    local.email = updated.email;
    local.role = updated.role;
    localStorage.setItem("learnsphere_user", JSON.stringify(local));
    window.dispatchEvent(new Event("userUpdated"));
    setMessage("Profile saved.");
    setForm((p) => ({ ...p, password: "" }));
  };

  const onLogout = () => {
    localStorage.removeItem("learnsphere_user");
    // keep studentName if present; it's unrelated to admin session
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>

        <form onSubmit={onSave} className="max-w-lg space-y-4">
          <div>
            <label className="block text-sm mb-1">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-md px-3 py-2 bg-[var(--card)] border border-[var(--border)]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-md px-3 py-2 bg-[var(--card)] border border-[var(--border)]"
            />
          </div>

          <div>
            <InputField
              label="Password (leave blank to keep current)"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
            />
          </div>

          {message && <div className="text-sm text-green-400">{message}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-md border bg-red-600 text-white"
            >
              Logout
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
