# .NET Core Backend Implementation Guide

This guide provides the **exact code** to build your backend. It uses **.NET 8/10**, **EF Core**, **SQL Server**, **Repository Pattern**, and **JWT Authentication**.

## 📂 Steps Overview

Follow these files in order:

1.  **[01-Setup-Config.md](./01-Setup-Config.md)**
    - Creating the project
    - Installing NuGet Packages
    - Folder Structure
    - `appsettings.json` (Connection String)

2.  **[02-Models-Database.md](./02-Models-Database.md)**
    - `User` & `StudentProfile` Models (matching React fields)
    - `AppDbContext`
    - Database Migration commands

3.  **[03-Repository-JWT.md](./03-Repository-JWT.md)**
    - Repository Pattern (IUserRepository)
    - JWT Token Service (Handling Login Security)
    - Dependency Injection in `Program.cs`

4.  **[04-Controllers-DTOs.md](./04-Controllers-DTOs.md)**
    - `AuthController` (Login/Register)
    - `StudentController` (Profile Update)
    - `AdminController` (View All Users)
    - Swagger "Authorize" Button Setup

5.  **[05-React-Integration.md](./05-React-Integration.md)**
    - React `api.js` code to connect to this backend.
