# Part 5: React Integration

Now that the backend is ready, here is how to connect your React App (`learn-sphere-ui`) to it.

## 1. Create API Service

Create a new file `src/services/api.js` (or update your existing `Api.jsx`).

```javascript
const BASE_URL = "https://localhost:7001/api"; // Check your port in launchSettings.json

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // 1. Auth
  register: async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();

    // Auto-save to localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  // 2. Student Profile
  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/Student/profile`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${BASE_URL}/Student/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error("Failed to update profile");
    return res.json();
  },

  // 3. Admin
  getAllUsers: async () => {
    const res = await fetch(`${BASE_URL}/Admin/users`, {
      headers: { ...getAuthHeaders() },
    });
    if (!res.ok) throw new Error("Unauthorized or Failed");
    return res.json();
  },
};
```

## 2. Usage in React Components

**In `LoginPage.jsx`:**

```javascript
import { api } from "../services/api";

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await api.login(email, password);
    navigate("/dashboard");
  } catch (err) {
    alert(err.message);
  }
};
```

**In `Profile.jsx`:**

```javascript
import { api } from "../services/api";
import { useEffect, useState } from "react";

const Profile = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getProfile().then(setData).catch(console.error);
  }, []);

  const handleSave = async () => {
    await api.updateProfile(data);
    alert("Saved!");
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
      />
      <textarea
        value={data.bio}
        onChange={(e) => setData({ ...data, bio: e.target.value })}
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};
```
