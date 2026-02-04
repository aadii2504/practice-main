# Part 4: Controllers & Swagger Auth

Now we create the API endpoints for Auth, Student Profile, and Admin.

## 1. Configure Auth in Program.cs

We need to tell the app to _use_ JWT Authentication and show the Lock icon in Swagger.

**Update `Program.cs`:**

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

// ... existing services ...

// 1. Add Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"]
        };
    });

// 2. Add Swagger Connect (The Lock Icon)
builder.Services.AddSwaggerGen(c => {
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme {
        Description = "JWT Authorization header. Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement() {
    {
        new OpenApiSecurityScheme {
            Reference = new OpenApiReference {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            },
            Scheme = "oauth2",
            Name = "Bearer",
            In = ParameterLocation.Header,
        },
        new List<string>()
    }});
});

// 3. Enable CORS (For React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173"); // Your React URL
    });
});

var app = builder.Build();

// ... existing pipeline ...

// 4. Use Middleware (ORDER MATTERS!)
app.UseCors("ReactPolicy");
app.UseAuthentication(); // <--- Add this
app.UseAuthorization();  // <--- Add this
```

## 2. Auth Controller

Handles Login and Register.

**File:** `Controllers/AuthController.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;
using LearnSphereAPI.DTOs;
using LearnSphereAPI.Interfaces;
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _repo;
        private readonly ITokenService _tokenService;

        public AuthController(IUserRepository repo, ITokenService tokenService)
        {
            _repo = repo;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto dto)
        {
            if (await _repo.UserExistsAsync(dto.Email))
                return BadRequest("Email already configured");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email.ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Student",
                StudentProfile = new StudentProfile() // Empty profile
            };

            await _repo.CreateUserAsync(user);

            var token = _tokenService.CreateToken(user);
            return Ok(new { token, user = new { user.Name, user.Email, user.Role } });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto dto)
        {
            var user = await _repo.GetUserByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("Invalid Email");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid Password");

            var token = _tokenService.CreateToken(user);
            return Ok(new { token, user = new { user.Name, user.Email, user.Role } });
        }
    }
}
```

## 3. Student Controller

Protected route for Profile Updates.

**File:** `Controllers/StudentController.cs`

```csharp
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LearnSphereAPI.DTOs;
using LearnSphereAPI.Interfaces;

namespace LearnSphereAPI.Controllers
{
    [Authorize] // <--- Protects everything
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IUserRepository _repo;

        public StudentController(IUserRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("profile")]
        public async Task<ActionResult<ProfileDto>> GetProfile()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _repo.GetUserByEmailAsync(email);
            if (user == null) return NotFound();

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

        [HttpPut("profile")]
        public async Task<ActionResult> UpdateProfile(ProfileDto dto)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var user = await _repo.GetUserByEmailAsync(email);
            if (user == null) return NotFound();

            // Update fields
            user.Name = dto.Name;
            if (user.StudentProfile == null) user.StudentProfile = new Models.StudentProfile();

            user.StudentProfile.Phone = dto.Phone;
            user.StudentProfile.Address = dto.Address;
            user.StudentProfile.Bio = dto.Bio;
            user.StudentProfile.Education = dto.Education;

            await _repo.UpdateUserAsync(user);
            return Ok(new { message = "Profile updated" });
        }
    }
}
```

## 4. Admin Controller

Only for Admins to view all users.

**File:** `Controllers/AdminController.cs`

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LearnSphereAPI.Interfaces;

namespace LearnSphereAPI.Controllers
{
    [Authorize(Roles = "Admin")] // <--- Only Admin role allowed
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IUserRepository _repo;

        public AdminController(IUserRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("users")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _repo.GetAllUsersAsync();
            return Ok(users.Select(u => new
            {
                u.Id,
                u.Name,
                u.Email,
                u.Role
            }));
        }
    }
}
```
