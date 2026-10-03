# EduConflux — Work Progress Report

> Audit date: 2026-10-03 · Scope: `educonflux-backend` (Spring Boot) + `educonflux-client` (React)
> Companion docs: [PHASE1.md](./PHASE1.md) (design brief) · [TODO.md](./TODO.md) (completed work)

Legend: ✅ Done · 🟡 Partial / backend-dependent · ❌ Not started

---

## 0. Executive Summary

| Area | Status | Summary |
|---|---|---|
| Backend | 🟢 ~85% | Core domain REST endpoints, STOMP chat broker, authentication, dashboards, curriculum, and users operational. |
| Frontend | 🟢 100% | Phase 1 + Portal MVP complete. React Router 7, ProtectedRoute guards, AppShell with search & notifications, role dashboards (Admin, Teacher, Student), change password, profile, 404. Clean `npm run build` with 0 errors. |
| Integration | 🟢 95% | Canonical role mapper (`authUtils.ts`), full DTO alignment for Academic, Directory, Timetable, Attendance, Classrooms, and Files. STOMP chat wired over `/ws`. |

---

## 1. Integration Status (Frontend ↔ Backend Contract)

### 1.1 Authentication & Roles — ✅ Aligned
- **Role Mapping:** `INSTITUTION_ADMIN`/`PLATFORM_ADMIN` → `ADMIN`, `FACULTY` → `TEACHER`, `STUDENT` → `STUDENT`.
- **Login Response:** Parsed directly from `{token, userId, email, roles, firstLogin}` with no dummy fallbacks.
- **Role Mismatch Detection:** Informs users when login role differs from account credentials.
- **Forced First-Time Setup:** `firstLogin === true` triggers instant redirect to `/change-password`.
- **Change Password:** Aligned with backend `{ currentPassword, newPassword }`.
- **Session Persistence:** `rememberMe` selects between `localStorage` and `sessionStorage`, hardened against Firefox private window security errors.

### 1.2 Academic DTOs — ✅ Aligned
- All academic types use backend field names (`name`, `code`, `programId`, `semesterId`, `semesterNumber`).
- Enums aligned: Academic status (`ACTIVE|INACTIVE|COMPLETED`), Course types (`CORE|ELECTIVE|LAB|PROJECT`).
- Cascade dropdowns in Admin Dashboard: Department → Program → Semester → Section.

### 1.3 Directory & Attendance — ✅ Aligned
- Student and Faculty creation modals aligned with backend requests and status toggles.
- Attendance register aligned with `PRESENT` / `ABSENT` status badges.

### 1.4 Classrooms, Chat & Files — ✅ Aligned
- WebSocket / STOMP real-time client connected to `/ws` via Vite proxy (`ws: true`).
- Subscribes to `/topic/classroom/{id}/chat` and sends to `/app/classroom/{id}/chat`.
- Files upload via multipart `HttpClient`, authenticated blob downloads, and fallback presigned URL downloads.
- Classroom Hub features announcements, materials, roster, and live chat.

### 1.5 Permission Mismatch Resolution — ✅ Fixed
- Teacher and Student dashboards no longer make forbidden `/admin/*` queries.
- Student dashboard uses `/api/student/dashboard`, `/api/student/classrooms`, `/api/student/attendance`, and `/api/student/timetable`.
- Mock "Dr. Sharma" classroom fallback removed; dynamic student enrollment and token-based classroom join implemented.

---

## 2. Frontend Architecture

### 2.1 Stack & Framework
- React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query 5, React Router, STOMP.js / SockJS.

### 2.2 Shared UI Design System
- `AppShell`: Sticky header with role badge, global Ctrl+K search trigger, notification bell dropdown, and user profile menu.
- Shared Components: `Modal`, `ToastProvider` / `useToast`, `PasswordInput`, `Card`, `LoadingState`, `ErrorState`, `EmptyState`, `Button`, `Input`, `Badge`, `Logo`.

### 2.3 Routing & Role Guards
- Centralized router with `react-router-dom`:
  - `/` → `LandingPage`
  - `/login` → `LoginPage`
  - `/forgot-password` → `ForgotPasswordPage`
  - `/activate` → `ActivationPage`
  - `/admin` → `ProtectedRoute (ADMIN)` → `AdminDashboard`
  - `/teacher` → `ProtectedRoute (TEACHER)` → `TeacherDashboard`
  - `/student` → `ProtectedRoute (STUDENT)` → `StudentDashboard`
  - `/change-password` → `ProtectedRoute` → `ChangePasswordPage`
  - `/profile` → `ProtectedRoute` → `ProfilePage`
  - `*` → `NotFoundPage`

---

## 3. Build & QA Verification
- Production build `npm run build` compiles with **0 errors**.
- Vite dev server runs with dual-stack localhost proxying.
