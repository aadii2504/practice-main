import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkDuplicateEmail,
  getUserByEmail,
} from "../components/registration/Api";
import { normalizeEmail } from "../components/registration/Validation";
import { InputField } from "../components/registration/InputField";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalized = normalizeEmail(email);

      const exists = await checkDuplicateEmail(normalized);
      if (!exists) {
        setError("No account found for this email. Please register.");
        return;
      }

      const stored = await getUserByEmail(normalized);
      if (!stored) {
        setError("No account found for this email. Please register.");
        return;
      }

      if (stored.password) {
        if (!password) {
          setError("Password is required for this account.");
          return;
        }
        if (password !== stored.password) {
          setError("Incorrect password.");
          return;
        }
      }

      const registeredName =
        stored.name || localStorage.getItem("studentName") || "Student";

      const user = {
        name: registeredName,
        email: normalized,
        role: stored.role || "student",
      };

      localStorage.setItem("learnsphere_user", JSON.stringify(user));
      window.dispatchEvent(new Event("userUpdated"));

      if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Login</h2>

      <form onSubmit={onSubmit} noValidate>
        <label className="block mb-2 text-sm">Email</label>
        <input
          className="w-full rounded-md px-3 py-2 mb-4 bg-[var(--card)] border border-[var(--border)]"
          type="email"
          value={email}
          placeholder="you@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <div className="text-sm text-red-400 mb-3">{error}</div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg px-4 py-2.5 font-semibold text-white bg-gradient-to-tr from-indigo-600 to-blue-500 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
