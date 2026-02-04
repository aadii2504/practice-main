# Part 2: Models & Database Context

Here we define the database tables. We double-checked your React `RegistrationForm` to make sure fields match.

## 1. Domain Models

Create these files in the `Models` folder.

**File:** `Models/User.cs`

```csharp
using System.Text.Json.Serialization; // Needed to ignore loop

namespace LearnSphereAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "Student"; // Default role

        // Relationship: One User has One Profile
        public StudentProfile? StudentProfile { get; set; }
    }
}
```

**File:** `Models/StudentProfile.cs`

```csharp
using System.Text.Json.Serialization;

namespace LearnSphereAPI.Models
{
    public class StudentProfile
    {
        public int Id { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Bio { get; set; }
        public string? Education { get; set; }

        // Foreign Key
        public int UserId { get; set; }

        [JsonIgnore] // Prevent infinite loop in JSON
        public User? User { get; set; }
    }
}
```

## 2. Database Context

Create this file in the `Data` folder. This acts as the bridge to SQL Server.

**File:** `Data/AppDbContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using LearnSphereAPI.Models;

namespace LearnSphereAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<StudentProfile> StudentProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure 1-to-1 Relationship
            modelBuilder.Entity<User>()
                .HasOne(u => u.StudentProfile)
                .WithOne(p => p.User)
                .HasForeignKey<StudentProfile>(p => p.UserId);
        }
    }
}
```

## 3. Register DbContext

We must tell the application to use this Context and the SQL Server connection string.

**Open `Program.cs` and add this logic:**
(Place this right after `var builder = WebApplication.CreateBuilder(args);`)

```csharp
using Microsoft.EntityFrameworkCore;
using LearnSphereAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ... rest of the code
```

## 4. Run Migrations

Now that code is ready, create the actual database.

```powershell
dotnet tool install --global dotnet-ef  # Run only if you haven't installed it before
dotnet ef migrations add InitialCreate
dotnet ef database update
```
