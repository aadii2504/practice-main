# Learn Sphere Backend - Part 2: API Endpoints & React Integration

## DTOs (Data Transfer Objects)

**Why DTOs?**

- Separate API contracts from database models
- Don't expose PasswordHash to clients
- Validate incoming data

---

### **File: DTOs/RegisterRequest.cs**

```csharp
using System.ComponentModel.DataAnnotations;

namespace LearnSphereAPI.DTOs
{
    public class RegisterRequest
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
            ErrorMessage = "Password must contain uppercase, lowercase, and number")]
        public string Password { get; set; }
    }
}
```

**Validation Rules:**

- Name: 2-100 characters
- Email: Valid email format
- Password: Min 8 chars, must have uppercase, lowercase, number

---

### **File: DTOs/LoginRequest.cs**

```csharp
using System.ComponentModel.DataAnnotations;

namespace LearnSphereAPI.DTOs
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
```

---

### **File: DTOs/UpdateProfileRequest.cs**

```csharp
namespace LearnSphereAPI.DTOs
{
    public class UpdateProfileRequest
    {
        public string? Phone { get; set; }
        public string? Course { get; set; }
        public string? Year { get; set; }
        public string? GuardianName { get; set; }
        public string? GuardianPhone { get; set; }
    }
}
```

All fields optional (nullable)

---

## Controllers

### **File: Controllers/AuthController.cs**

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using LearnSphereAPI.Data;
using LearnSphereAPI.Models;
using LearnSphereAPI.DTOs;

namespace LearnSphereAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // 1. Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            // 2. Hash password with BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // 3. Create user
            var user = new User
            {
                Name = request.Name,
                Email = request.Email.ToLower(),
                PasswordHash = passwordHash,
                Role = "student",  // Default role
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 4. Create empty student profile
            var profile = new StudentProfile
            {
                UserId = user.Id
            };
            _context.StudentProfiles.Add(profile);
            await _context.SaveChangesAsync();

            // 5. Generate JWT token
            var token = GenerateJwtToken(user);

            // 6. Return response
            return Ok(new
            {
                message = "Registration successful",
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role
                },
                token = token
            });
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email.ToLower());

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // 2. Verify password
            bool isValidPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isValidPassword)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // 3. Generate JWT token
            var token = GenerateJwtToken(user);

            // 4. Return response
            return Ok(new
            {
                message = "Login successful",
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role
                },
                token = token
            });
        }

        // Helper method to generate JWT token
        private string GenerateJwtToken(User user)
        {
            var jwtSecret = _configuration["Jwt:Secret"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];
            var jwtExpiry = int.Parse(_configuration["Jwt:ExpiryInMinutes"]);

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(jwtExpiry),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
```

**Explanation:**

**Register Flow:**

1. Check if email exists
2. Hash password with BCrypt (never store plain passwords!)
3. Create User record in database
4. Create empty StudentProfile linked to user
5. Generate JWT token
6. Return user data + token

**Login Flow:**

1. Find user by email
2. Verify password using BCrypt.Verify()
3. Generate JWT token
4. Return user data + token

**JWT Token:**

- Contains user info (id, email, name, role)
- Signed with secret key
- Expires in 60 minutes
- React app sends this in Authorization header

---

### **File: Controllers/ProfileController.cs**

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LearnSphereAPI.Data;
using LearnSphereAPI.DTOs;

namespace LearnSphereAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]  // Requires JWT token
    public class ProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Profile
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            // Get user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim);

            // Get user with profile
            var user = await _context.Users
                .Include(u => u.StudentProfile)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new
            {
                id = user.Id,
                name = user.Name,
                email = user.Email,
                role = user.Role,
                profile = user.StudentProfile == null ? null : new
                {
                    phone = user.StudentProfile.Phone,
                    course = user.StudentProfile.Course,
                    year = user.StudentProfile.Year,
                    guardianName = user.StudentProfile.GuardianName,
                    guardianPhone = user.StudentProfile.GuardianPhone
                }
            });
        }

        // PUT: api/Profile
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            // Get user ID from JWT token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim);

            // Get profile
            var profile = await _context.StudentProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return NotFound(new { message = "Profile not found" });
            }

            // Update fields
            if (request.Phone != null) profile.Phone = request.Phone;
            if (request.Course != null) profile.Course = request.Course;
            if (request.Year != null) profile.Year = request.Year;
            if (request.GuardianName != null) profile.GuardianName = request.GuardianName;
            if (request.GuardianPhone != null) profile.GuardianPhone = request.GuardianPhone;

            profile.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile updated successfully",
                profile = new
                {
                    phone = profile.Phone,
                    course = profile.Course,
                    year = profile.Year,
                    guardianName = profile.GuardianName,
                    guardianPhone = profile.GuardianPhone
                }
            });
        }
    }
}
```

**Explanation:**

**`[Authorize]` attribute:**

- Requires valid JWT token
- User must be logged in

**Get User ID from Token:**

```csharp
var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
```

- Extracts user ID from JWT claims
- `User` is automatically populated by ASP.NET Core

**`.Include(u => u.StudentProfile)`:**

- Loads related StudentProfile data
- Without this, profile would be null

---

### **File: Controllers/CoursesController.cs**

```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LearnSphereAPI.Data;
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CoursesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _context.Courses
                .Where(c => c.Status == "published")
                .Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.Slug,
                    c.Summary,
                    c.Thumbnail,
                    c.Level,
                    c.Lessons
                })
                .ToListAsync();

            return Ok(courses);
        }

        // GET: api/Courses/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return Ok(course);
        }
    }
}
```

---

## React Integration

### **Step 1: Create API Service**

**File: src/services/api.js**

```javascript
const API_URL = "https://localhost:7001/api"; // Your .NET API URL

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API Error");
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  register: async (name, email, password) => {
    return apiCall("/Auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email, password) => {
    return apiCall("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
};

// Profile APIs
export const profileAPI = {
  get: async () => {
    return apiCall("/Profile");
  },

  update: async (profileData) => {
    return apiCall("/Profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};

// Courses APIs
export const coursesAPI = {
  getAll: async () => {
    return apiCall("/Courses");
  },

  getById: async (id) => {
    return apiCall(`/Courses/${id}`);
  },
};
```

---

### **Step 2: Update LoginPage to Use API**

**File: src/pages/LoginPage.jsx** (modify)

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call .NET API
      const response = await authAPI.login(email, password);

      // Save token and user
      localStorage.setItem('token', response.token);
      localStorage.setItem('learnsphere_user', JSON.stringify(response.user));

      // Dispatch event for Navbar update
      window.dispatchEvent(new Event('userUpdated'));

      // Navigate based on role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... JSX same as before ...
  );
}
```

---

### **Step 3: Update RegistrationForm**

**File: src/components/Registration/RegistrationForm.jsx** (modify)

```javascript
import { authAPI } from "../services/api";

const onSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  // Validate form
  const isValid = await validateAll();
  if (!isValid) {
    setSubmitting(false);
    return;
  }

  try {
    // Call .NET API
    const response = await authAPI.register(
      form.name,
      form.email,
      form.password,
    );

    // Save token and user
    localStorage.setItem("token", response.token);
    localStorage.setItem("learnsphere_user", JSON.stringify(response.user));

    // Dispatch event
    window.dispatchEvent(new Event("userUpdated"));

    // Navigate
    navigate("/dashboard");
  } catch (err) {
    setMessage(err.message || "Registration failed");
  } finally {
    setSubmitting(false);
  }
};
```

---

### **Step 4: Update Profile Page**

**File: src/pages/Profile.jsx** (modify)

```javascript
import { useEffect, useState } from 'react';
import { profileAPI } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileAPI.get();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      await profileAPI.update(updates);
      loadProfile();  // Reload
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    // ... JSX using profile.phone, profile.course, etc ...
  );
}
```

---

## Testing the API

### **Using Swagger:**

1. Run .NET API: `dotnet run`
2. Open browser: `https://localhost:7001/swagger`
3. Test endpoints:
   - POST /api/Auth/register
   - POST /api/Auth/login
   - GET /api/Profile (need token)
   - PUT /api/Profile (need token)

### **Using Postman:**

**Register:**

```
POST https://localhost:7001/api/Auth/register
Body (JSON):
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Login:**

```
POST https://localhost:7001/api/Auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "Password123"
}

Response:
{
  "token": "eyJhbGci...",
  "user": { ... }
}
```

**Get Profile (need token):**

```
GET https://localhost:7001/api/Profile
Headers:
Authorization: Bearer eyJhbGci...
```

---

## Summary

✅ **DTOs created** - Request/response models  
✅ **AuthController** - Register & Login endpoints  
✅ **ProfileController** - Get & Update profile  
✅ **CoursesController** - Get courses  
✅ **React API service** - Centralized API calls  
✅ **React pages updated** - Use real API instead of localStorage  
✅ **JWT authentication** - Secure endpoints

**Your React app now talks to .NET backend!**
