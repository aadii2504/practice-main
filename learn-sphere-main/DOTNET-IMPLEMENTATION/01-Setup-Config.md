# Part 1: Project Setup & Configuration

## 1. Create the Project

Open your terminal in the folder where you want the backend (e.g., inside `learn-sphere-main`).

```powershell
# Create new Web API project
dotnet new webapi -n LearnSphereAPI

# Enter the folder
cd LearnSphereAPI
```

## 2. Install NuGet Packages

Run these commands to install EF Core, SQL Server, and JWT support.

```powershell
# Entity Framework Core & SQL Server
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design

# JWT Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# Password Hashing (BCrypt)
dotnet add package BCrypt.Net-Next
```

## 3. Create Folder Structure

Inside `LearnSphereAPI`, create these folders to organize your code:

- `Models` (Database tables)
- `Data` (Database connection context)
- `DTOs` (Data Transfer Objects - what we send/receive)
- `Interfaces` (For Repository Pattern)
- `Repositories` (Database logic)
- `Services` (Helper logic like Tokens)
- `Controllers` (API Endpoints - usually already exists)

## 4. Configure AppSettings (Database & JWT)

Open `appsettings.json`. Replace the content with this.

- **ConnectionStrings**: Points to your SQL Express.
- **Jwt**: Settings for generating secure tokens.

**File:** `appsettings.json`

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
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=LearnSphereDB;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Issuer": "http://localhost:5000",
    "Audience": "http://localhost:3000",
    "Secret": "ThisIsASecretKeyForLearnSphereProject12345!"
  }
}
```

_(Note: The `Secret` key must be long, at least 32 characters, or it will error)._
