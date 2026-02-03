# Learn Sphere Backend - Part 4: Student Profile & Protected Routes

This part implements the **Student Profile** feature. This is where we verify that our **JWT Authentication** and **Repository Pattern** are working together to protect data.

> [!NOTE]
> **"Updated Code Only"**: This guide assumes you have finished Parts 1-3. We are adding _new_ files and _new_ methods to existing files.

---

## 1. Create Profile DTOs

We need a clean way to send profile data back and forth without exposing the entire User object (like password hashes).

### **[NEW] File: DTOs/ProfileDto.cs**

_(What we send TO the frontend)_

```csharp
namespace LearnSphereAPI.DTOs
{
    public class ProfileDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }

        // Flattened properties from StudentProfile for easier frontend use
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Bio { get; set; }
        public string? Education { get; set; }
    }
}
```

### **[NEW] File: DTOs/UpdateProfileRequest.cs**

_(What we verify FROM the frontend)_

```csharp
namespace LearnSphereAPI.DTOs
{
    public class UpdateProfileRequest
    {
        public string Name { get; set; } // Allow name update too
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Bio { get; set; }
        public string? Education { get; set; }
    }
}
```

---

## 2. Create the Student Controller

This controller handles fetching and updating profile data.

- It uses `[Authorize]` so only logged-in users can access it.
- It uses `User.FindFirst(...)` to identify _who_ is calling the API from their Token.

### **[NEW] File: Controllers/StudentController.cs**

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using LearnSphereAPI.DTOs;
using LearnSphereAPI.Interfaces;

namespace LearnSphereAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // <--- CRITICALLY IMPORTANT: Protects all endpoints below!
    public class StudentController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public StudentController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Helper method to get current User ID from the Token
        private int GetUserId()
        {
            var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(idClaim);
        }

        // GET: api/student/profile
        [HttpGet("profile")]
        public async Task<ActionResult<ProfileDto>> GetProfile()
        {
            // 1. Identify User
            var userId = GetUserId();

            // 2. Fetch Data
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return NotFound("User not found");

            // 3. Map to DTO (Return only safe data)
            return Ok(new ProfileDto
            {
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                Phone = user.StudentProfile?.Phone,
                Address = user.StudentProfile?.Address,
                Bio = user.StudentProfile?.Bio,
                Education = user.StudentProfile?.Education
            });
        }

        // PUT: api/student/profile
        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile(UpdateProfileRequest request)
        {
            // 1. Identify User
            var userId = GetUserId();
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null) return NotFound("User not found");

            // 2. Update User Base Info
            user.Name = request.Name;

            // 3. Update Profile Info (Ensure profile exists)
            if (user.StudentProfile == null)
            {
                user.StudentProfile = new Models.StudentProfile();
            }

            user.StudentProfile.Phone = request.Phone;
            user.StudentProfile.Address = request.Address;
            user.StudentProfile.Bio = request.Bio;
            user.StudentProfile.Education = request.Education;

            // 4. Save Changes via Repository
            await _userRepository.UpdateUserAsync(user);

            return Ok(new { message = "Profile updated successfully" });
        }
    }
}
```

---

## 3. Verify Repository Capabilities

We need to ensure our `UserRepository` handles data including the `StudentProfile`.

**Check `Repositories/UserRepository.cs` (from Part 3):**
Ensure your `GetByIdAsync` method looks like this. The `.Include()` is the magic part that loads the profile data.

```csharp
public async Task<User?> GetByIdAsync(int id)
{
    // [UPDATED CODE CHECK] - Make sure .Include is here!
    return await _context.Users
        .Include(u => u.StudentProfile)
        .FirstOrDefaultAsync(u => u.Id == id);
}
```

---

## 4. React Integration (Service Update)

Now update your React `api.js` (or `StudentService.js`) to use these new endpoints. Note that we now need to include the **Token** in the headers.

### **[UPDATED] File: src/components/Registration/Api.js** (or wherever you keep api calls)

```javascript
// Add these new functions to your existing API object

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("learnsphere_user"));
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const studentAPI = {
  // [NEW] Get Profile
  getProfile: async () => {
    const response = await fetch(`${BASE_URL}/Student/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(), // Auto-adds "Authorization: Bearer <token>"
      },
    });
    if (!response.ok) throw new Error("Failed to fetch profile");
    return await response.json();
  },

  // [NEW] Update Profile
  updateProfile: async (profileData) => {
    // profileData should match UpdateProfileRequest DTO:
    // { name, phone, address, bio, education }

    const response = await fetch(`${BASE_URL}/Student/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) throw new Error("Failed to update profile");
    return await response.json();
  },
};
```

---

## 5. Usage in React Component (`Profile.jsx`)

Here is a quick example of how to connect the dots in your Profile page.

```jsx
import { studentAPI } from "../api"; // Import the new service

// Inside your component...
const handleSave = async () => {
  try {
    const updatedData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      education: formData.education,
      bio: formData.bio,
    };

    await studentAPI.updateProfile(updatedData);
    alert("Profile Updated Successfully!");

    // Optional: Refresh data
    const newData = await studentAPI.getProfile();
    setProfile(newData);
  } catch (error) {
    console.error("Update failed", error);
    alert("Failed to update profile");
  }
};
```
