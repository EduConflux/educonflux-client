# EduConflux — To-Do

> See [WORK_PROGRESS.md](./WORK_PROGRESS.md) for current status and [PHASE1.md](./PHASE1.md) for the design brief.
> Priority: **P0** = blocks a stable integration · **P1** = needed for a complete MVP · **P2** = enhancements

---

## 1. Integration (do first — this is what stabilises the app)

### P0 — Auth contract
- [x] Pick a role mapping. Kept backend names and mapped them in `lib/authUtils.ts`: `INSTITUTION_ADMIN`/`PLATFORM_ADMIN` → `ADMIN`, `FACULTY` → `TEACHER`, `STUDENT` → `STUDENT`.
- [x] Parse `LoginResponse {token, userId, email, roles, firstLogin}` directly. Removed the `'active-session-token'` fallback and the UI-selected role fallback.
- [x] If the selected role ≠ the actual role, show an error instead of redirecting silently.
- [x] Handle `firstLogin = true` by redirecting to a forced change-password screen (`/change-password`).
- [x] Fix the change-password body: `oldPassword` → `currentPassword`.
- [x] Frontend extracts user from `LoginResponse` and populates profile with name, role, and email.

### P0 — DTO alignment (generate shared types or rewrite `features/*/types.ts`)
- [x] Academic types: `name`/`code` instead of the prefixed fields. Semester uses `programId` + `semesterNumber`. Course uses `programId`, `semesterId`, `courseType CORE|ELECTIVE|LAB|PROJECT`. ClassSection uses `semesterId`, `description`.
- [x] Align status enums: academic `ACTIVE|INACTIVE|COMPLETED`, faculty `ACTIVE|INACTIVE|ON_LEAVE`, student adds `WITHDRAWN`.
- [x] Update the AdminDashboard forms and tables to the new fields (cascade selects: department → program → semester → section).
- [x] Classroom response: use `courseName`, `courseCode`, `classSectionName`, `status`. Drop `room`, `invitationCode`, `unreadCount`.
- [x] Post type: `ANNOUNCEMENT|GENERAL`.
- [x] Chat message: `content`, `createdAt`, `messageType`.
- [x] Attendance: remove `EXCUSED` (frontend adheres to `PRESENT|ABSENT`).
- [x] Timetable create: send `courseOfferingId` + `facultyAssignmentId`.
- [x] File response: `fileUrl`, `createdAt`.

### P0 — Permission mismatches
- [x] Student and Teacher dashboards stop calling `/api/admin/*`. Using `/api/student/dashboard`, `/api/faculty/dashboard`, the timetable, attendance, and classroom endpoints.
- [x] Removed the mock "Dr. Sharma" classroom fallback in `StudentDashboard.tsx`.

### P0 — Files
- [x] Fix `learningApi.uploadFile` to go through `HttpClient` with multipart FormData.
- [x] Download through authenticated blob fetch (`apiClient.downloadFile`) and `GET /api/files/{id}/url`.
- [x] Local Supabase S3 file configuration support verified.

### P1 — Real-time chat
- [x] Added `/ws` WebSocket proxy (with `ws: true`) to `vite.config.ts`.
- [x] Added `@stomp/stompjs` + `sockjs-client`. Connects with JWT Authorization header, subscribes to `/topic/classroom/{id}/chat`, sends to `/app/classroom/{id}/chat`.
- [x] Real-time chat wired in `ClassroomHub.tsx` with websocket manager (`src/lib/websocket.ts`).

### P1 — Error contract
- [x] Frontend maps 401 → clear session + redirect to `/login?expired=true`, 403 → access denied state, 404 → not found, 400 → structured `message` and field `errors` toast.

### P1 — Wire unused backend features
- [x] Dashboards (`/api/{role}/dashboard`) → MetricCards across Admin, Teacher, Student.
- [x] Notifications (bell dropdown + unread count badge + mark as read API).
- [x] Global search (Ctrl+K trigger + debounced search API + result navigation modal).
- [x] Classroom invitations / join (`useJoinClassroom` with invitation token modal).
- [x] Curriculum admin (course offerings, faculty assignments, student enrollments).
- [x] Users admin (user listing, role/status filtering, create user, reset password).

### P1 — Environment
- [x] Added `.env.example` with `VITE_API_BASE_URL`.
- [x] Configured Vite dev proxy for dual-stack Windows localhost.

---

## 2. Backend (Reference / Coordination)

### P0
- [x] **CORS**: `CorsConfigurationSource` bean allowing frontend origin (port 5173).
- [x] `SessionCreationPolicy.STATELESS`.
- [x] Role rules for endpoints: `/api/admin/**`, `/api/student/**`, `/api/faculty/**`.
- [x] **GlobalExceptionHandler**: JSON responses for auth exceptions, validation errors, and entity not found.

### P1
- [x] Role endpoints for dashboards (`/api/{admin|faculty|student}/dashboard`).
- [x] Attendance APIs (`/api/faculty/attendance`, `/api/student/attendance`).
- [x] STOMP WebSocket broker at `/ws` with SockJS fallback.

---

## 3. Frontend

### P0
- [x] Add **react-router**: Replaced manual pathname state with `react-router-dom` `<Routes>`, `<Route>`, `<BrowserRouter>`.
- [x] `ProtectedRoute` with role guard. Redirects unauthenticated users to `/login` and wrong-role users to their respective dashboards.
- [x] `HttpClient`: 401 → clear session + redirect to `/login?expired=true`. Typed errors (`ApiError`).
- [x] Fix double `login()` call.
- [x] Remove duplicate `types/auth.ts`.

### P1 — Phase 1 completion
- [x] Forgot password: responsive page with validation and institutional email submission.
- [x] Remember me: `sessionStorage` vs `localStorage` session persistence based on checkbox.
- [x] Parent login: blocked with a modern Phase 2 announcement banner.
- [x] Shared components: `Modal`, `ToastProvider` / `useToast`, `PasswordInput`, `Card`, `LoadingState`, `ErrorState`, `EmptyState`.
- [x] Cleaned up unused `components/landing/*`.
- [x] Accessibility pass: clean focus rings, keyboard Enter/Space, accessible ARIA attributes.
- [x] Responsive layout across desktop, tablet, and mobile.

### P1 — App features
- [x] App shell: sticky topbar with global search (Ctrl+K), notification dropdown, and profile menu shared across all portals.
- [x] Change-password screen (forced on first login, voluntary from profile).
- [x] Profile page with user info, role badges, and security navigation.
- [x] Admin: program and semester creation, status toggles, curriculum screens, users management.
- [x] Teacher: create/archive classroom, invite students by ID, mark roster attendance, weekly timetable view.
- [x] Student: join classroom with token, attendance records and percentage, weekly timetable, real-time metrics.
- [x] 404 Not Found page with return-to-home navigation.

### P2
- [ ] Parent dashboard (awaiting backend module).
- [x] Dead code cleanup: removed `SectionChannelsChatWorkspace` and unused imports.
- [x] Clean production build: `npm run build` passes with 0 TypeScript errors.
