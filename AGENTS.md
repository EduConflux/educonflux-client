# EduConflux Frontend — Agent Guidelines

## Project

EduConflux is an Education Operations Platform.

This repository contains the **React frontend**.

The current version is focused on a **single educational institution**.

Do not introduce multi-tenancy or future-version features unless explicitly requested.

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand

Use the existing project setup. Do not replace the stack.

---

## Development Principles

- Keep the code simple and maintainable.
- Use reusable React components.
- Prefer composition over duplicated code.
- Use TypeScript properly.
- Avoid `any` unless absolutely necessary.
- Keep components focused on a single responsibility.
- Keep API/data logic separate from UI components.
- Follow existing project conventions before introducing new patterns.

Do not over-engineer simple features.

---

## UI / Design

EduConflux should look like a **modern commercial SaaS product**, not a traditional college ERP.

Design inspiration:

- Notion
- Slack
- Linear
- Microsoft Teams
- Google Workspace

Do not copy their designs.

### Brand Colors

Primary orange:

`#F97316`

Primary background:

`#FFFFFF`

Primary text:

`#171717`

Secondary text:

`#525252`

Muted text:

`#737373`

Border:

`#E5E5E5`

Soft background:

`#F7F7F7`

Use orange mainly for:

- Primary buttons
- Active states
- Important actions
- Highlights

Do not make the entire interface orange.

---

## UI Guidelines

Prefer:

- Clean layouts
- Good whitespace
- Clear typography
- Subtle borders
- Moderate border radius
- Minimal shadows
- Responsive layouts
- Accessible components

Avoid:

- Generic admin dashboards
- Bootstrap-style layouts
- Excessive gradients
- Excessive glassmorphism
- Excessive animations
- Excessive colors
- Unnecessary visual complexity

---

## Components

Create reusable components when UI is shared.

Example:

```text
src/
├── components/
├── pages/
├── layouts/
├── hooks/
├── lib/
├── store/
└── types/
```

Follow the existing structure if it differs.

Do not create unnecessary folders or abstractions.

---

## Current Phase

Phase 1 focuses on:

- Landing Page
- Login Page
- Role Selection
- Admin Login
- Teacher Login
- Student Login
- Parent Login
- Forgot Password UI
- Form validation
- Loading and error states
- Responsive design

Do not implement other application modules unless explicitly requested.

---

## Code Changes

Before making changes:

1. Understand the existing code.
2. Reuse existing components where possible.
3. Make the smallest clean change required.
4. Check for TypeScript errors.
5. Check that existing functionality still works.

Do not modify unrelated files.

---

## Important

When requirements are unclear, ask before making major architectural or design decisions.

Prefer **simple, clean, production-quality code** over unnecessary complexity.