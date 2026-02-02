# .NET Core Backend - Quick Start Guide

## Complete Setup Steps

### 1. Create New Project

```bash
# Open terminal in desired location
dotnet new webapi -n LearnSphereAPI
cd LearnSphereAPI
code .
```

### 2. Install NuGet Packages

```bash
dotnet add package Microsoft.EntityFrameworkCore --version 9.0.0
dotnet add package Microsoft.EntityFrameworkCore.SqlServer --version 9.0.0
dotnet add package Microsoft.EntityFrameworkCore.Tools --version 9.0.0
dotnet add package Microsoft.EntityFrameworkCore.Design --version 9.0.0
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 9.0.0
dotnet add package System.IdentityModel.Tokens.Jwt --version 8.2.1
dotnet add package BCrypt.Net-Next --version 4.0.3
```

### 3. Create Folder Structure

```bash
# Create folders
mkdir Models
mkdir Data
mkdir DTOs
mkdir Controllers
```

### 4. Copy Code Files

**Copy from Part 1:**

- `Models/User.cs`
- `Models/StudentProfile.cs`
- `Models/Course.cs`
- `Models/Enrollment.cs`
- `Data/AppDbContext.cs`
- `appsettings.json` (update connection string)
- `Program.cs` (replace entire file)

**Copy from Part 2:**

- `DTOs/RegisterRequest.cs`
- `DTOs/LoginRequest.cs`
- `DTOs/UpdateProfileRequest.cs`
- `Controllers/AuthController.cs`
- `Controllers/ProfileController.cs`
- `Controllers/CoursesController.cs`

### 5. Update appsettings.json

```json
{
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

### 6. Create Database

```bash
# Add migration
dotnet ef migrations add InitialCreate

# Create database and tables
dotnet ef database update
```

**If you get error "No executable found matching command dotnet-ef":**

```bash
dotnet tool install --global dotnet-ef
```

### 7. Run API

```bash
dotnet run
```

**API will start at:**

- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5000`

**Swagger UI:** `https://localhost:7001/swagger`

---

## React Integration

### 1. Create API Service

**File: `src/services/api.js`** (create new file)

Copy the code from Part 2 → React Integration → Step 1

### 2. Update Login Page

**File: `src/pages/LoginPage.jsx`**

Replace the `onSubmit` function with code from Part 2

### 3. Update Registration Form

**File: `src/components/Registration/RegistrationForm.jsx`**

Replace the `onSubmit` function with code from Part 2

### 4. Update Profile Page

**File: `src/pages/Profile.jsx`**

Add `loadProfile` and `updateProfile` functions from Part 2

---

## Testing

### Test with Swagger

1. Open `https://localhost:7001/swagger`
2. Click "POST /api/Auth/register"
3. Click "Try it out"
4. Enter:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test1234"
}
```

5. Click "Execute"
6. Should get response with token and user

### Test with React App

1. Start .NET API: `dotnet run`
2. Start React app: `npm run dev`
3. Go to `http://localhost:5173/register`
4. Register new account
5. Should redirect to dashboard

---

## Common Commands

```bash
# Run API
dotnet run

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback last migration
dotnet ef database update PreviousMigrationName

# Remove last migration
dotnet ef migrations remove

# Drop database
dotnet ef database drop

# Restore packages
dotnet restore

# Build project
dotnet build
```

---

## Troubleshooting

### Error: "Cannot connect to database"

**Solution:** Check SQL Server is running, connection string is correct

### Error: "CORS policy blocked"

**Solution:** Ensure `app.UseCors("AllowReactApp")` is BEFORE `app.UseAuthentication()`

### Error: "401 Unauthorized"

**Solution:** Check JWT token is in Authorization header: `Bearer <token>`

### Error: "Password validation failed"

**Solution:** Password must have uppercase, lowercase, and number, min 8 chars

---

## API Endpoints

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| POST   | `/api/Auth/register` | Register new user | No            |
| POST   | `/api/Auth/login`    | Login user        | No            |
| GET    | `/api/Profile`       | Get user profile  | Yes           |
| PUT    | `/api/Profile`       | Update profile    | Yes           |
| GET    | `/api/Courses`       | Get all courses   | No            |
| GET    | `/api/Courses/{id}`  | Get single course | No            |

---

## Next Steps

1. Add more controllers (Enrollments, Admin)
2. Add role-based authorization
3. Add file upload for profile pictures
4. Add validation
5. Add logging
6. Deploy to Azure/AWS

---

## File Checklist

**Models:**

- ✅ User.cs
- ✅ StudentProfile.cs
- ✅ Course.cs
- ✅ Enrollment.cs

**Data:**

- ✅ AppDbContext.cs

**DTOs:**

- ✅ RegisterRequest.cs
- ✅ LoginRequest.cs
- ✅ UpdateProfileRequest.cs

**Controllers:**

- ✅ AuthController.cs
- ✅ ProfileController.cs
- ✅ CoursesController.cs

**Config:**

- ✅ appsettings.json
- ✅ Program.cs

**React:**

- ✅ src/services/api.js
- ✅ Update LoginPage.jsx
- ✅ Update RegistrationForm.jsx
- ✅ Update Profile.jsx

---

**You're ready to integrate .NET backend with React frontend!**
