# ThinkEra — Workspace Knowledge

This document serves as the single source of truth for the **ThinkEra** workspace. All development activities must adhere to the rules, design tokens, and structures defined below.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js + React + Tailwind CSS + Framer Motion
- **Backend:** Node.js + PostgreSQL
- **AI:** Gemini API
- **Deployment:** Vercel

---

## 📂 Folder Structure
```text
src/
  app/          → Next.js app router pages
  components/   → Reusable UI components
  mock/         → Mock JSON data files (topics.json, problems.json, community.json, users.json)
  lib/          → Utility functions, API helpers
  hooks/        → Custom React hooks
  styles/       → Global styles
```

---

## 💾 Mock Data Rule
- **ALWAYS** use mock data from `/src/mock/` by default.
- **NEVER** make real API calls unless explicitly instructed: *"connect to backend"* or *"wire up the API"*.
- **Mock data files:** 
  - `topics.json`
  - `problems.json`
  - `community.json`
  - `users.json`
  - `sessions.json`

---

## 🚨 Build Rules (CRITICAL — Follow Every Single Time)
1. **NEVER** modify pages or components outside the one specified in the prompt.
2. **NEVER** change colors, fonts, spacing, or any design tokens unless explicitly asked.
3. **NEVER** refactor existing working code while building something new.
4. **ALWAYS** keep Framer Motion animations intact — do not remove or replace them.
5. **ALWAYS** ask before making any architectural decision not covered in this knowledge base.
6. **ONE** page per prompt — build only what is asked, nothing more.
7. If a prompt is unclear, **ask ONE clarifying question** before building.

---

## 🚦 Routing & Auth
- Use **Next.js App Router** (not Pages Router).
- Protected routes redirect to `/auth/login` if unauthenticated.
- After login:
  - Students go to `/dashboard`
  - Admins go to `/admin/dashboard`
- Role is stored in the user session/JWT and checked on every protected route.
- `/admin/*` routes are admin-only — redirect students to `/dashboard` with a toast.

---

## 🧭 Navigation Pattern
- **Global top bar:** Always visible across all pages.
  - **Left:** ThinkEra logo → links to `/dashboard`
  - **Center:** Learn | Roadmap | Problems | Community | Focus
  - **Right:** AI Mentor icon | Notifications bell | User avatar dropdown
- **Contextual left sidebar:** Appears inside each section (not global).
- **Mobile:** Top bar collapses to hamburger, sidebar becomes bottom sheet drawer.

---

## 🧩 Component Rules
- **Mobile-first:** Every component must be fully responsive.
- Use **Tailwind utility classes only** — no custom CSS files unless absolutely necessary.
- **Skeleton screens** for every component that fetches data (never show empty + loading together).
- **Toast notifications:** Bottom-right, non-blocking, auto-dismiss after 3s (errors stay until dismissed).
- All modals must be dismissable via Escape key or backdrop click.

---

## 🎨 Design Tokens (Single Source of Truth)
- **Primary:** `#2563EB` (blue)
- **Dark:** `#1E3A5F` (navy)
- **Text:** `#374151` (grey-700)
- **Muted:** `#6B7280` (grey-500)
- **Background:** `#F8FAFF` (light blue-grey)
- **Success:** `#065F46` | **Success bg:** `#ECFDF5`
- **Error:** `#991B1B` | **Error bg:** `#FEF2F2`
- **Warning:** `#92400E` | **Warning bg:** `#FFFBEB`
- **Border:** `#E2E8F0`
- **Font:** Inter (headings bold, body regular)
- **Border radius:** `rounded-xl` for cards, `rounded-lg` for buttons, `rounded-full` for badges
- **Card shadow:** `shadow-sm` on default, `shadow-md` on hover

---

## 🔄 State Variations (Required on Every Page)
Every page and component must handle all 4 states:
1. **Loading** → skeleton screen
2. **Empty** → helpful message + CTA button
3. **Error** → error message + retry button
4. **Success** → normal rendered content

---

## ✨ Interaction Patterns
- **Optimistic updates:** Upvotes, watched/read toggles, bookmarks — update UI first, sync silently.
- **Confetti:** Trigger on first problem solve, roadmap phase completion, streak milestones.
- **AI Mentor responses:** Streaming typewriter effect via SSE.
- **Progress rings:** SVG animated fill on first render (750ms ease-out).
- **Page transitions:** Framer Motion fade+slide (0.2s ease).

---

## ❌ What NEVER to Do
- Never use `localStorage` for user progress (use backend + React state).
- Never hardcode user data — always pull from session/context.
- Never build multiple pages in one prompt.
- Never skip the loading and empty states.
- Never use inline styles — Tailwind only.
