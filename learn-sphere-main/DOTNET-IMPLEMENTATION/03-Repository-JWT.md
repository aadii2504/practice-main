# Part 3: Repository Pattern & Services

We use the **Repository Pattern** to keep database logic separate from Controllers, and a **TokenService** for JWT.

## 1. DTOs (Data Transfer Objects)

Create these in `DTOs` folder. These control what data JSON we accept/return.

**File:** `DTOs/RegisterDto.cs`

```csharp
namespace LearnSphereAPI.DTOs
{
    public class RegisterDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
```

**File:** `DTOs/LoginDto.cs`

```csharp
namespace LearnSphereAPI.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
```

**File:** `DTOs/ProfileDto.cs`

```csharp
namespace LearnSphereAPI.DTOs
{
    public class ProfileDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Bio { get; set; }
        public string? Education { get; set; }
    }
}
```

## 2. Interfaces

Create in `Interfaces` folder.

**File:** `Interfaces/IUserRepository.cs`

```csharp
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(int id);
        Task<List<User>> GetAllUsersAsync(); // Needed for Admin
        Task<bool> UserExistsAsync(string email);
        Task CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
    }
}
```

**File:** `Interfaces/ITokenService.cs`

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

## 3. Implementations

Create in `Repositories` and `Services` folders.

**File:** `Repositories/UserRepository.cs`

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
        public UserRepository(AppDbContext context) => _context = context;

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.StudentProfile) // Load profile too
                .FirstOrDefaultAsync(u => u.Email == email.ToLower());
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.StudentProfile)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .Include(u => u.StudentProfile)
                .ToListAsync();
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

**File:** `Services/TokenService.cs`

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
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
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

## 4. Update Program.cs (Dependency Injection)

Go back to `Program.cs` and add these **before** `builder.Build()`.

```csharp
using LearnSphereAPI.Interfaces;
using LearnSphereAPI.Repositories;
using LearnSphereAPI.Services;

// ... after AddDbContext line ...

// Dependency Injection
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();
```
