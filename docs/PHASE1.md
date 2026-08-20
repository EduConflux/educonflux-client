# EduConflux Frontend — Development Tasks

## Phase 1 — Landing Page & Authentication

### Objective

Build the first user-facing experience of EduConflux:

- Public landing page
- Login experience
- Role-based authentication entry
- Initial responsive design system
- EduConflux visual identity

The goal is to establish the visual language and interaction patterns that will be used throughout the application.

---

# 1. Product Context

**Product:** EduConflux

**Type:** Education Operations Platform

EduConflux is designed as a unified digital platform for educational institutions, combining:

- Academic Operations
- Learning Management
- Communication
- Collaboration
- Notifications
- Analytics
- Administration

EduConflux should NOT visually resemble a traditional:

- Student Management System
- College ERP
- College Portal
- Government portal
- Generic CRUD dashboard

The design should feel like a modern commercial SaaS product.

Design inspiration:

- Notion
- Slack
- Linear
- Microsoft Teams
- Discord
- Google Workspace

Do not copy these products. Use them only as references for usability, layout quality, interaction patterns, and visual polish.

---

# 2. Phase 1 Scope

## Included

### Public Landing Page

- Navbar
- EduConflux logo
- Product positioning
- Hero section
- Primary CTA
- Secondary CTA
- Product preview / visual section
- Core platform benefits
- Feature highlights
- Collaboration preview
- Academic operations preview
- Footer

### Authentication

- Login page
- Role selection
- Admin login
- Teacher login
- Student login
- Parent login
- Forgot password entry
- Remember me
- Authentication error states
- Loading states

### Responsive Design

Support:

- Desktop
- Tablet
- Mobile

---

# 3. Phase 1 User Roles

EduConflux currently supports four primary user roles:

| Role | Purpose |
|---|---|
| Admin | Manages institution operations and users |
| Teacher | Manages classes, learning, attendance and communication |
| Student | Accesses learning, academics and communication |
| Parent | Monitors linked student's academic activity |

The authentication UI should make these roles clearly distinguishable without making the interface feel like four separate applications.

---

# 4. Brand Identity

## Brand

**EduConflux**

The brand represents:

- Education
- Connection
- Collaboration
- Convergence
- Unified institutional operations

The logo is a minimal geometric symbol using the EduConflux visual language.

The logo should be used consistently throughout the application.

---

# 5. Color System

## Primary Colors

### Orange

Use orange as the primary brand accent.

Purpose:

- Primary CTA
- Active navigation
- Selected states
- Important actions
- Highlights
- Focus states
- Brand accents

Recommended base:

```text
Primary Orange: #F97316
```

Use the exact logo colors where available and keep the UI palette visually consistent with the logo.

---

## Neutral Colors

### Background

```text
White: #FFFFFF
```

### Primary Text

```text
Charcoal: #171717
```

### Secondary Text

```text
Gray: #525252
```

### Muted Text

```text
Light Gray: #737373
```

### Borders

```text
Border Gray: #E5E5E5
```

### Secondary Background

```text
Soft Gray: #F7F7F7
```

---

# 6. Color Usage Rules

Do NOT make the entire application orange.

The visual hierarchy should approximately follow:

```text
White / Neutral
        ↓
Charcoal
        ↓
Gray
        ↓
Orange Accent
```

Orange should attract attention to important actions rather than dominate the interface.

Avoid:

- Neon colors
- Excessive gradients
- Rainbow palettes
- Excessive glassmorphism
- Heavy shadows
- Excessive orange backgrounds

---

# 7. Typography

Use a modern sans-serif typeface.

Recommended:

- Inter
- Geist
- Manrope

Typography should prioritize:

- Readability
- Clear hierarchy
- Modern SaaS appearance
- Consistent spacing

Suggested hierarchy:

```text
Hero Heading
        ↓
Section Heading
        ↓
Subheading
        ↓
Body
        ↓
Supporting Text
```

Avoid overly decorative fonts.

---

# 8. Visual Language

The overall design should feel:

- Modern
- Minimal
- Premium
- Intelligent
- Professional
- Clean
- Collaborative
- Enterprise-ready

Use:

- Rounded cards
- Subtle borders
- Soft shadows
- Generous whitespace
- Clean iconography
- Strong typography
- Consistent spacing

Do not over-round every component.

---

# 9. Landing Page

## Navbar

Include:

```text
EduConflux Logo

Platform
Features
About

Login
Get Started
```

The navbar should remain clean and minimal.

Primary CTA:

```text
Get Started
```

Secondary action:

```text
Login
```

---

# 10. Hero Section

The hero should immediately communicate the product.

Suggested positioning:

> The operating platform for modern education.

Supporting message should communicate that EduConflux brings academics, learning, communication, collaboration and analytics into one unified platform.

Primary CTA:

```text
Get Started
```

Secondary CTA:

```text
Explore Platform
```

The hero should contain a polished visual representation of the EduConflux application.

Avoid generic stock illustrations.

Prefer:

- Product UI preview
- Dashboard preview
- Workspace visualization
- Abstract collaboration visualization

---

# 11. Feature Preview

Show the major platform capabilities.

Recommended categories:

### Academic Operations

Classes, courses, attendance and timetables.

### Learning

Assignments, homework, resources and submissions.

### Communication

Messaging, announcements and collaboration.

### Analytics & Reporting

Institutional performance insights and analytics reporting.

Each feature should have:

- Icon
- Short title
- Short description
- Visual preview where appropriate

---

# 12. Login Page

The login experience should be significantly simpler than the landing page.

Recommended layout:

```text
┌──────────────────────────────────────────────┐
│                                              │
│             EduConflux Logo                  │
│                                              │
│          Welcome back                       │
│     Sign in to your workspace               │
│                                              │
│      [ Select your role ▼ ]                 │
│                                              │
│      Email                                  │
│      [________________________]             │
│                                              │
│      Password                               │
│      [________________________]             │
│                                              │
│      ☑ Remember me      Forgot password?    │
│                                              │
│      [          Sign In          ]          │
│                                              │
│          ← Back to EduConflux               │
│                                              │
└──────────────────────────────────────────────┘
```

The login page should feel calm, focused and professional.

---

# 14. Role Selection

The login page should support four roles:

```text
Admin
Teacher
Student
Parent
```

Role selection can use:

- Segmented control
- Tabs
- Select menu
- Four compact cards

Preferred visual approach:

Four clean role cards or tabs with simple icons.

Each role should have a short description.

Example:

```text
Admin
Manage your institution

Teacher
Manage classes and learning

Student
Access your academic workspace

Parent
Monitor your child's progress
```

---

# 15. Role-Specific Visual Treatment

Keep the overall brand consistent.

Do NOT create four completely different themes.

All roles use:

- Same typography
- Same spacing
- Same orange accent
- Same component system
- Same logo

Only the content and contextual messaging change.

---

# 16. Authentication States

Design the following states:

### Default

Normal login form.

### Loading

Button changes to loading state.

### Invalid Credentials

Display clear inline error.

### Validation Error

Examples:

- Invalid email
- Empty password
- Missing role

### Network Error

Provide a clear retry action.

### Forgot Password

Provide a simple email submission screen.

### Successful Authentication

Show a short transition/loading state before entering the user's workspace.

---

# 17. Responsive Design

## Desktop

Primary target.

Use:

- Full navbar
- Wide hero
- Multi-column feature sections
- Large product previews

## Tablet

Adapt:

- Navigation
- Feature grids
- Hero layout

## Mobile

Use:

- Compact navbar
- Mobile menu
- Stacked hero
- Single-column sections
- Full-width CTA
- Mobile-friendly login form

The interface must not simply shrink the desktop layout.

---

# 18. Accessibility

Follow accessible UI principles.

Ensure:

- Sufficient color contrast
- Keyboard navigation
- Visible focus states
- Proper labels
- Accessible buttons
- Semantic HTML
- Clear error messages
- Screen-reader-friendly form controls

---

# 19. Component Strategy

Create reusable components from the beginning.

Examples:

```text
Navbar
Logo
Button
Input
PasswordInput
RoleSelector
Card
Badge
Modal
Toast
LoadingState
ErrorState
Footer
```

Do not duplicate UI components for each role.

---

# 20. Frontend Architecture Preparation

The Phase 1 UI should be designed so that later modules can use the same design system.

Future application structure will eventually include:

```text
Landing

Authentication

        ↓

Application Shell

        ↓

Dashboard

Academic

Learning

Communication

Notifications

Calendar

Reports

Administration
```

Phase 1 should establish the foundation for the application shell.

---

# 21. Design Quality Requirements

The final design must look like a real commercial SaaS product.

It should be suitable for:

- Production development
- Portfolio presentation
- Resume showcase
- Technical demonstrations
- Future expansion

Avoid:

- Generic Bootstrap layouts
- Template-looking dashboards
- Excessive cards
- Excessive colors
- Clipart
- Stock education illustrations
- Overly academic visual language

---

# 22. Phase 1 Deliverables

### UI/UX

- [ ] Landing Page
- [ ] Login Page
- [ ] Role Selection
- [ ] Admin Login State
- [ ] Teacher Login State
- [ ] Student Login State
- [ ] Parent Login State
- [ ] Forgot Password UI
- [ ] Authentication Error States
- [ ] Loading States
- [ ] Responsive Desktop Design
- [ ] Responsive Tablet Design
- [ ] Responsive Mobile Design

### Design System

- [ ] Color palette
- [ ] Typography
- [ ] Spacing system
- [ ] Button styles
- [ ] Input styles
- [ ] Card styles
- [ ] Icon system
- [ ] Form states
- [ ] Error states
- [ ] Loading states

### Engineering Preparation

- [ ] Reusable component structure
- [ ] Responsive layout system
- [ ] Accessibility considerations
- [ ] Consistent naming
- [ ] Consistent design tokens

---

# 23. Google Stitch Prompt

Use the following prompt to generate the Phase 1 UI:

> Design the landing page and authentication experience for **EduConflux**, a premium Education Operations Platform.
>
> EduConflux is not a traditional student management system or college ERP. It is designed as a unified digital workspace for educational institutions, combining academic operations, learning management, communication, collaboration, notifications, and analytics.
>
> Create ONLY the Phase 1 experience:
>
> 1. Public landing page
> 2. Login page
> 3. Role selection
> 4. Authentication states for Admin, Teacher, Student and Parent
>
> Do not design dashboards or internal application modules yet.
>
> The visual style should feel like a modern commercial SaaS product inspired by the quality and usability of Notion, Slack, Linear, Microsoft Teams and Google Workspace. Do not copy their interfaces.
>
> Use the EduConflux brand identity:
>
> - Primary accent: orange
> - Dominant background: white and soft neutral gray
> - Primary text: dark charcoal
> - Secondary text: neutral gray
> - Borders: subtle light gray
> - Orange should be used strategically for CTAs, active states, highlights and AI elements.
>
> The design must be minimal, premium, clean, intelligent and enterprise-ready.
>
> Avoid generic college portals, ERP dashboards, Bootstrap layouts, excessive gradients, excessive glassmorphism, neon colors, excessive shadows, stock education illustrations and overly colorful interfaces.
>
> Use modern sans-serif typography such as Inter, Geist or Manrope.
>
> Use generous whitespace, strong typography hierarchy, subtle borders, moderately rounded components, clean icons and polished micro-interactions.
>
> The landing page should contain:
>
> - Minimal navbar
> - EduConflux logo
> - Platform navigation
> - Login CTA
> - Get Started CTA
> - Strong hero section
> - Product UI preview
> - Platform capability highlights
> - AI capability section
> - Collaboration section
> - Academic operations section
> - Clean footer
>
> The hero should communicate the concept of a unified operating platform for modern education.
>
> The login page should contain:
>
> - EduConflux logo
> - Welcome message
> - Role selector
> - Admin
> - Teacher
> - Student
> - Parent
> - Email field
> - Password field
> - Remember me
> - Forgot password
> - Sign In button
> - Validation states
> - Loading state
> - Authentication error state
>
> Role selection should use four elegant, compact options:
>
> Admin — Manage your institution
>
> Teacher — Manage classes and learning
>
> Student — Access your academic workspace
>
> Parent — Monitor your child's progress
>
> Keep the same EduConflux design system across all four roles. Do not create separate color themes for each role.
>
> Design desktop-first but provide responsive layouts for tablet and mobile.
>
> Prioritize usability, accessibility, visual hierarchy, consistency and reusable component patterns.
>
> The final result should look like a real production SaaS product that could be launched commercially, not a university project.