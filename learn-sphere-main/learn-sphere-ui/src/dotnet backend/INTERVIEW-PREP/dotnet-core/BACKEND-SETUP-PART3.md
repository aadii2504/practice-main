# Learn Sphere Backend - Part 3: Repository Pattern & Clean Architecture

This part refactors our backend to use the **Repository Design Pattern**. This makes the code cleaner, easier to test, and separates the "Data Access Logic" from the "Business Logic" (Controllers).

---

## 📂 New Folder Structure

Add these folders to your project:

```
LearnSphereAPI/
├── Interfaces/          # Defines WHAT we can do
│   ├── IUserRepository.cs
│   └── ITokenService.cs
├── Repositories/        # Defines HOW we handle database
│   └── UserRepository.cs
├── Services/            # Helper logic (like JWT)
│   └── TokenService.cs
```

---

## 1. Repository Pattern Implementation

The Repository manages all database operations. The Controller never talks to `AppDbContext` directly anymore.

### **File: Interfaces/IUserRepository.cs**

```csharp
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Interfaces
{
    public interface IUserRepository
    {
        // Define simple methods we need
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task<bool> UserExistsAsync(string email);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        // We can add more later (e.g., GetProfile)
    }
}
```

### **File: Repositories/UserRepository.cs**

```csharp
using Microsoft.EntityFrameworkCore;
using LearnSphereAPI.Data;
using LearnSphereAPI.Interfaces;
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            // Include profile to retrieve everything at once
            return await _context.Users
                .Include(u => u.StudentProfile)
                .FirstOrDefaultAsync(u => u.Email == email.ToLower());
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.StudentProfile)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email.ToLower());
        }

        public async Task CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
```

---

## 2. JWT Token Service (Clean Auth)

Instead of writing JWT logic inside the Controller, we move it to a dedicated **Service**. This is "Single Responsibility Principle".

### **File: Interfaces/ITokenService.cs**

```csharp
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
```

### **File: Services/TokenService.cs**

```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using LearnSphereAPI.Interfaces;
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly string _issuer;
        private readonly string _audience;

        // Constructor gets config from appsettings.json
        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Secret"]));
            _issuer = config["Jwt:Issuer"];
            _audience = config["Jwt:Audience"];
        }

        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()), // Stores ID
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("Name", user.Name) // Custom claim for Name
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7), // Token lasts 7 days
                SigningCredentials = creds,
                Issuer = _issuer,
                Audience = _audience
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
```

---

## 3. Register Services in Program.cs

We need to tell .NET to use our new Repository and Service.

### **Update File: Program.cs**

Add these lines **before** `builder.Build()`:

```csharp
// ... existing DbContext setup ...

// REGISTER REPOSITORIES & SERVICES (Dependency Injection)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();

// ... existing Auth/Swagger setup ...

var app = builder.Build();
```

**Why `AddScoped`?**
It creates a new instance for every HTTP request (e.g., every time someone logs in).

---

## 4. Refactored AuthController (Clean & Simple)

Now the Controller is beautiful. It just coordinates the logic.

### **File: Controllers/AuthController.cs**

```csharp
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using LearnSphereAPI.DTOs;
using LearnSphereAPI.Interfaces;
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // We inject Interfaces, NOT DbContext directly!
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;

        public AuthController(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<object>> Register(RegisterRequest request)
        {
            // 1. Check duplicate
            if (await _userRepository.UserExistsAsync(request.Email))
                return BadRequest("Email is already taken");

            // 2. Hash Password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // 3. Create User Object
            var user = new User
            {
                Name = request.Name,
                Email = request.Email.ToLower(),
                PasswordHash = hashedPassword,
                Role = "student",
                StudentProfile = new StudentProfile() // Create empty profile immediately
            };

            // 4. Save to DB via Repository
            await _userRepository.CreateUserAsync(user);

            // 5. Return Token & User Data
            return Ok(new
            {
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    role = user.Role
                },
                token = _tokenService.CreateToken(user)
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginRequest request)
        {
            // 1. Get User from Repository
            var user = await _userRepository.GetByEmailAsync(request.Email);

            if (user == null)
                return Unauthorized("Invalid email");

            // 2. Check Password
            var validPass = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!validPass)
                return Unauthorized("Invalid password");

            // 3. Return Token & User Data
            return Ok(new
            {
                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    role = user.Role
                },
                token = _tokenService.CreateToken(user)
            });
        }
    }
}
```

---

## 5. Integrating with React (Authentication Flow)

Just to double-check, here is how the React app connects to this new clean structure. Since the JSON response format is the same, your **existing React code works perfectly**.

**React `api.js` Recap:**

```javascript
// This works with the code above!
export const authAPI = {
  login: async (email, password) => {
    // Hits POST https://localhost:7001/api/Auth/login
    // Expects: { user: {...}, token: "..." }
    // We are returning exactly that!
    return apiCall("/Auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  // ... register is same ...
};
```

---

## Summary of Improvements

1.  **Repository Pattern**: `AuthController` doesn't know about `DbContext` or SQL. It just asks `IUserRepository` to "GetByEmail" or "CreateUser". If we switch database later, we only change the Repository.
2.  **DTOs**: We use `RegisterRequest` and `LoginRequest` (created in Part 2) to ensure we only get the data we need.
3.  **Token Service**: JWT logic is hidden in `TokenService`. Code is reusable and cleaner.
4.  **Relationships**: When registering, we automatically create an empty `StudentProfile` so the profile page won't crash later.

This code is **production-ready**, uses modern **clean architecture**, and fits directly into the VS Code "Purple" templates (Web API).
