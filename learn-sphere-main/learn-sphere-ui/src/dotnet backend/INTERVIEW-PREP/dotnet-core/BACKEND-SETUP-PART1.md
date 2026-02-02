# Learn Sphere Backend - Complete .NET Core Setup Guide

## Part 1: Models & Database Setup

---

## Project Structure

```
LearnSphereAPI/
├── Models/
│   ├── User.cs
│   ├── StudentProfile.cs
│   ├── Course.cs
│   └── Enrollment.cs
├── Data/
│   └── AppDbContext.cs
├── Controllers/
│   ├── AuthController.cs
│   ├── ProfileController.cs
│   └── CoursesController.cs
├── DTOs/
│   ├── LoginRequest.cs
│   ├── RegisterRequest.cs
│   └── UpdateProfileRequest.cs
├── appsettings.json
└── Program.cs
```

---

## Step 1: Models (What Data We Store)

### **File: Models/User.cs**

```csharp
using System.ComponentModel.DataAnnotations;

namespace LearnSphereAPI.Models
{
    public class User
    {
        [Key]  // Primary key
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; }

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; }  // Encrypted password

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "student";  // "student" or "admin"

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation property (relationship)
        public StudentProfile? StudentProfile { get; set; }
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
```

**Explanation:**

- `[Key]` - Makes `Id` the primary key (auto-increment)
- `[Required]` - Field cannot be null in database
- `[StringLength(100)]` - Maximum length constraint
- `[EmailAddress]` - Validates email format
- `PasswordHash` - We **never** store plain passwords, only hashed
- `Role` - Default is "student"
- `CreatedAt` - Automatically sets to current time
- `StudentProfile?` - Optional, one-to-one relationship
- `Enrollments` - One user can have many enrollments

---

### **File: Models/StudentProfile.cs**

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearnSphereAPI.Models
{
    public class StudentProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }  // Foreign key to User

        [StringLength(15)]
        public string? Phone { get; set; }

        [StringLength(100)]
        public string? Course { get; set; }  // e.g., "Computer Science"

        [StringLength(20)]
        public string? Year { get; set; }  // e.g., "2nd Year"

        [StringLength(100)]
        public string? GuardianName { get; set; }

        [StringLength(15)]
        public string? GuardianPhone { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Navigation property
        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
```

**Explanation:**

- `UserId` - Links to User table (foreign key)
- `?` after type - Means nullable (optional field)
- `[ForeignKey("UserId")]` - Tells EF this is the foreign key relationship
- All profile fields are optional (nullable)

---

### **File: Models/Course.cs**

```csharp
using System.ComponentModel.DataAnnotations;

namespace LearnSphereAPI.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; }

        [Required]
        [StringLength(200)]
        public string Slug { get; set; }  // URL-friendly ID

        [Required]
        public string Summary { get; set; }

        public string? Description { get; set; }

        [StringLength(500)]
        public string? Thumbnail { get; set; }

        [StringLength(50)]
        public string Level { get; set; } = "beginner";

        public int Lessons { get; set; } = 0;

        [StringLength(20)]
        public string Status { get; set; } = "published";

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}
```

---

### **File: Models/Enrollment.cs**

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LearnSphereAPI.Models
{
    public class Enrollment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int CourseId { get; set; }

        public int Progress { get; set; } = 0;  // 0-100%

        public DateTime EnrolledAt { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("CourseId")]
        public Course Course { get; set; }
    }
}
```

**Explanation:**

- Junction table for many-to-many relationship
- One user can enroll in many courses
- One course can have many students
- `Progress` tracks completion percentage

---

## Step 2: Database Context

### **File: Data/AppDbContext.cs**

```csharp
using Microsoft.EntityFrameworkCore;
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Data
{
    public class AppDbContext : DbContext
    {
        // Constructor - receives configuration from Program.cs
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSets - Each represents a table in database
        public DbSet<User> Users { get; set; }
        public DbSet<StudentProfile> StudentProfiles { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }

        // Configure relationships and constraints
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User email must be unique
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Course slug must be unique
            modelBuilder.Entity<Course>()
                .HasIndex(c => c.Slug)
                .IsUnique();

            // One User has one StudentProfile (optional)
            modelBuilder.Entity<User>()
                .HasOne(u => u.StudentProfile)
                .WithOne(p => p.User)
                .HasForeignKey<StudentProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);  // Delete profile when user deleted

            // One User has many Enrollments
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.User)
                .WithMany(u => u.Enrollments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // One Course has many Enrollments
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
```

**Explanation:**

**`DbContext`:**

- Bridge between C# code and SQL database
- Manages database connections and queries

**`DbSet<User> Users`:**

- Represents `Users` table in database
- You query it like: `dbContext.Users.Where(u => u.Email == "test@example.com")`

**`OnModelCreating`:**

- Configure database schema
- Set unique constraints
- Define relationships

**`DeleteBehavior.Cascade`:**

- When User is deleted, StudentProfile is also deleted
- When User is deleted, all Enrollments are deleted

---

## Step 3: appsettings.json

### **File: appsettings.json**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=LearnSphereDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyMinimum32CharactersLong!",
    "Issuer": "LearnSphereAPI",
    "Audience": "LearnSphereClient",
    "ExpiryInMinutes": 60
  }
}
```

**Explanation:**

**Connection String Parts:**

- `Server=.\\SQLEXPRESS` - SQL Server Express on local machine
- `Database=LearnSphereDB` - Database name
- `Trusted_Connection=True` - Use Windows authentication
- `TrustServerCertificate=True` - Trust SSL certificate

**JWT Settings:**

- `Secret` - Used to sign JWT tokens (keep this secret!)
- `Issuer` - Who created the token
- `Audience` - Who can use the token
- `ExpiryInMinutes` - Token valid for 60 minutes

---

## Step 4: NuGet Packages to Install

**Open Terminal in VS Code:**

```bash
# Entity Framework Core packages
dotnet add package Microsoft.EntityFrameworkCore --version 9.0.0
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 9.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 9.0.0
dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.0.0

# JWT Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 9.0.0
dotnet add package System.IdentityModel.Tokens.Jwt --version 8.2.1

# Password Hashing
dotnet add package BCrypt.Net-Next --version 4.0.3
```

**Why Each Package:**

- `EntityFrameworkCore` - Main EF library
- `SqlServer` - SQL Server provider
- `Tools` - For migrations (Add-Migration, Update-Database)
- `Design` - Design-time services
- `JwtBearer` - JWT token authentication
- `IdentityModel.Tokens.Jwt` - Create/validate JWT tokens
- `BCrypt.Net-Next` - Hash passwords securely

---

## Step 5: Program.cs Configuration

### **File: Program.cs**

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using LearnSphereAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Add CORS (Allow React app to call API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // Vite default port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 3. Add JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"];
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// 4. Add Controllers
builder.Services.AddControllers();

// 5. Add Swagger (API documentation)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");  // MUST be before Authentication
app.UseAuthentication();  // Check JWT token
app.UseAuthorization();   // Check permissions
app.MapControllers();

app.Run();
```

**Explanation:**

**1. Database Context:**

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));
```

- Registers AppDbContext with dependency injection
- Uses SQL Server with connection string from appsettings.json

**2. CORS:**

```csharp
policy.WithOrigins("http://localhost:5173")
```

- Allows React app (running on port 5173) to call API
- Without this, browser blocks requests (CORS error)

**3. JWT Authentication:**

- Validates JWT tokens sent by React app
- Checks signature, issuer, audience, expiry

**4. Middleware Order:**

```csharp
app.UseCors();           // 1st
app.UseAuthentication(); // 2nd
app.UseAuthorization();  // 3rd
```

Order matters! CORS must come before Authentication.

---

## Step 6: Create Database

**Open Package Manager Console or Terminal:**

```bash
# Create migration (generates C# code for database schema)
dotnet ef migrations add InitialCreate

# Update database (creates tables in SQL Server)
dotnet ef database update
```

**What happens:**

1. EF Core reads your Models
2. Generates SQL to create tables
3. Runs SQL against your database
4. Tables created: Users, StudentProfiles, Courses, Enrollments

**Verify in SSMS:**

```sql
USE LearnSphereDB;
SELECT * FROM Users;
SELECT * FROM StudentProfiles;
SELECT * FROM Courses;
SELECT * FROM Enrollments;
```

---

## Summary So Far

✅ **Models created** - User, StudentProfile, Course, Enrollment  
✅ **AppDbContext configured** - Database connection and relationships  
✅ **appsettings.json** - Connection string and JWT config  
✅ **NuGet packages installed** - EF Core, JWT, BCrypt  
✅ **Program.cs configured** - CORS, Authentication, Database  
✅ **Database created** - Tables ready in SQL Server

---

## Next Steps

Continue to **Part 2** for:

- DTOs (Data Transfer Objects)
- AuthController (Login/Register endpoints)
- ProfileController (Update profile endpoint)
- React integration code
