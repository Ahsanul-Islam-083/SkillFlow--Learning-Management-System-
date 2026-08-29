# 🎓 SkillFlow LMS — Enterprise Learning Management System

<div align="center">

![SkillFlow LMS Banner](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop)

### Modern, High-Performance Headless E-Learning Platform with 4-Tier Role-Based Access Control

[![Next.js](https://img.shields.io/badge/Next.js-16.3.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Strapi](https://img.shields.io/badge/Strapi-v5.52.1-4945FF?style=for-the-badge&logo=strapi&logoColor=white)](https://strapi.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.20-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Deployment](https://img.shields.io/badge/Deployed_on-Vercel_%26_Railway-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://skill-flow-lms.vercel.app)

<br />

[🌐 Live Frontend Application](https://skill-flow-lms.vercel.app) • [⚡ Live Backend API](https://skillflow-learning-management-system-production.up.railway.app) • [🛡️ Strapi Admin Dashboard](https://skillflow-learning-management-system-production.up.railway.app/admin) • [🎥 10-Minute Video Walkthrough](https://drive.google.com/file/d/1wvVs8gn7BCqTAYFnN0DA3fChy5QNRFmE/view?usp=sharing)

</div>

---

## 📑 Table of Contents

- [🌟 Live Deployments & Quick Links](#-live-deployments--quick-links)
- [📖 Project Overview](#-project-overview)
- [🏛️ System Architecture](#️-system-architecture)
- [👥 User Experience & Feature Breakdown](#-user-experience--feature-breakdown)
  - [1. Visitor / Public Experience](#1-visitor--public-experience)
  - [2. Student / Learner Portal](#2-student--learner-portal)
  - [3. Instructor Studio](#3-instructor-studio)
  - [4. Content Manager & Editorial Studio](#4-content-manager--editorial-studio)
  - [5. System Administrator Console](#5-system-administrator-console)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [💻 Local Installation & Setup Guide](#-local-installation--setup-guide)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup (Strapi v5)](#2-backend-setup-strapi-v5)
  - [3. Backend Permissions & Roles Configuration](#3-backend-permissions--roles-configuration)
  - [4. Frontend Setup (Next.js 16)](#4-frontend-setup-nextjs-16)
- [🔑 Environment Variables Reference](#-environment-variables-reference)
- [🗂️ Project Directory Structure](#️-project-directory-structure)
- [📡 Core API Endpoints](#-core-api-endpoints)
- [🚀 Production Deployment Guide](#-production-deployment-guide)
- [📄 License & Credits](#-license--credits)

---

## 🌟 Live Deployments & Quick Links

| Service | Environment | URL / Resource |
| :--- | :--- | :--- |
| **Frontend Web App** | Production (Vercel) | [https://skill-flow-lms.vercel.app](https://skill-flow-lms.vercel.app) |
| **Backend REST API** | Production (Railway) | [https://skillflow-learning-management-system-production.up.railway.app](https://skillflow-learning-management-system-production.up.railway.app) |
| **Strapi Admin Panel** | Production (Railway) | [https://skillflow-learning-management-system-production.up.railway.app/admin](https://skillflow-learning-management-system-production.up.railway.app/admin) |
| **Demo Walkthrough** | 10-Minute Video | [Google Drive Video Walkthrough](https://drive.google.com/file/d/1wvVs8gn7BCqTAYFnN0DA3fChy5QNRFmE/view?usp=sharing) |

---

## 📖 Project Overview

**SkillFlow** is an enterprise-grade, full-stack Learning Management System (LMS) engineered for seamless curriculum delivery, interactive self-assessments, and comprehensive educational operations. 

Built with a decoupled **Headless CMS architecture**, SkillFlow pairs **Next.js 16 (App Router)** and **React 19** on the client with **Strapi v5** and **PostgreSQL** on the backend. It features a complete **4-role ecosystem** (*Student, Instructor, Content Manager, Admin*) providing tailored workspaces for learners, course creators, editorial managers, and system administrators.

### Core Highlights
- ⚡ **Blazing Fast Performance**: Server Components, streaming rendering, and optimized caching with Next.js 16.
- 🎯 **1-Click Free Enrollment**: Instant enrollment workflow with dual-synced state (Strapi REST API + LocalStorage fallback).
- 🎥 **Distraction-Free Video Player**: Custom learning theatre supporting embedded streaming, syllabus navigation, and markdown lecture notes.
- 🧠 **Interactive MCQ Assessment Engine**: Auto-grading engine with live countdown timer, scoring breakdown, pass/fail evaluation, and historical submission tracking.
- 📝 **Editorial Markdown Studio**: Blog publication system with live preview, category taxonomies, and ImgBB CDN image upload integration.
- 🛡️ **Granular Enterprise RBAC**: Strict role enforcement for Student, Instructor, Content Manager, and Admin with dynamic role promotion.
- 🌓 **Sleek Dual Theme (Dark / Light)**: Fluid theme switching powered by `next-themes` and Tailwind CSS v4.

---

## 🏛️ System Architecture

```mermaid
graph TD
    User([User Browser / Mobile]) -->|HTTPS / UI Interaction| NextApp[Next.js 16 Client & Server App]
    NextApp -->|JWT Authenticated REST API| Strapi[Strapi v5 Headless CMS API Engine]
    Strapi -->|CRUD Queries / Relations| Postgres[(PostgreSQL / SQLite Database)]
    NextApp -->|Direct Image Uploads| ImgBB[ImgBB Cloud CDN]
    Strapi -->|Role Authorization| RBAC[Users & Permissions Plugin]

    subgraph "Frontend Layer (Vercel)"
        NextApp
        Theme[next-themes Dark/Light]
        AuthCtx[Auth Context & Cookies]
    end

    subgraph "Backend Services (Railway)"
        Strapi
        RBAC
        Postgres
    end
```

---

## 👥 User Experience & Feature Breakdown

SkillFlow is designed with a **role-first user experience**, providing distinct capabilities based on who is using the platform:

```
                                  ┌───────────────────┐
                                  │   Public Visitor  │
                                  └─────────┬─────────┘
                                            │ (Register / Login)
                        ┌───────────────────┴───────────────────┐
                        ▼                                       ▼
            ┌───────────────────────┐               ┌───────────────────────┐
            │   Student / Learner   │               │      Staff Roles      │
            └───────────────────────┘               └───────────┬───────────┘
                                                                │
                        ┌───────────────────────────────────────┼───────────────────────────────────────┐
                        ▼                                       ▼                                       ▼
            ┌───────────────────────┐               ┌───────────────────────┐               ┌───────────────────────┐
            │      Instructor       │               │    Content Manager    │               │     Administrator     │
            │   (Course Authoring)  │               │ (Editorial & Catalog) │               │   (Full Governance)   │
            └───────────────────────┘               └───────────────────────┘               └───────────────────────┘
```

---

### 1. Visitor / Public Experience

Visitors can explore the platform freely before creating an account:
- **Dynamic Landing Page**: Hero section with interactive animations, platform statistics, featured popular curriculum tracks, recent blog posts, and role-based onboarding CTA cards.
- **Searchable Course Catalog**: Real-time keyword search, category filter pills (*Web Development, App Development, Data Science, UI/UX Design*), and difficulty level filtering (*Beginner, Intermediate, Advanced*).
- **Course Detail Overview**: Comprehensive course view with title, badges, syllabus accordion, instructor biography, lesson counts, estimated duration, and introductory **Free Preview Lectures**.
- **Tech Publication / Blog**: Read high-impact engineering articles and tutorials with reading-time estimates, categories, and formatted Markdown rendering.
- **Interactive About & FAQ**: Core educational pillars, platform metrics, and interactive accordion FAQ addressing common learner inquiries.
- **Authentication Suite**: Secure sign-up and sign-in via email/password, session cookie persistence, and Google OAuth integration ready.

---

### 2. Student / Learner Portal

A dedicated workspace for tracking learning milestones and enrolled curricula:
- **Personal Student Dashboard (`/dashboard/student`)**:
  - Top banner with personalized welcome and quick catalog link.
  - KPI metric cards: *My Courses*, *In Progress*, *Completed*, and *Average Completion Rate*.
  - Enrolled course cards featuring thumbnail, category badge, completion status tag, progress bar, and 1-click **Resume Learning** action.
- **Curriculum Learning Theatre (`/courses/[slug]/learn`)**:
  - Distraction-free full-screen theatre player.
  - Support for YouTube video embeds and direct video streams.
  - Lecture notes & summaries formatted with Markdown.
  - Sequential lecture navigation with **"Mark as Complete & Next"** action.
  - Real-time progress bar syncing directly with the database.
  - Collapsible course syllabus drawer for desktop and mobile.
- **Live MCQ Assessment Engine (`/courses/[slug]/quiz/[quizId]`)**:
  - Live countdown examination timer (default 5-minute timed test).
  - Multiple-choice questions with single-select answers and smooth transitions.
  - Instant client-side & server-side auto-grading against correct answers.
  - Pass/Fail grading with percentage score calculation (60% passing threshold).
  - **Results Screen**: Visual confetti celebration on passing, total score summary, question-by-question answer review, and attempt persistence in Strapi (`/quiz-submissions`).
- **Profile & Security Settings (`/profile`)**:
  - Account information card showing username, email, assigned role, and join date.
  - Password update form with current password verification and length validation.

---

### 3. Instructor Studio

A specialized authoring studio for educators and curriculum developers:
- **Instructor Dashboard (`/dashboard/instructor`)**:
  - Authoring statistics: *My Courses*, *Total Lessons*, and *Quizzes Built*.
  - List of authored courses with publication state indicators (*Published* vs *Draft*).
- **Course Creator & Syllabus Builder (`/dashboard/instructor/courses/new`)**:
  - Create new course tracks with title, slug, category, difficulty level, thumbnail URL, and descriptions.
  - Add, edit, and reorder video lectures with title, duration, video URL, content notes, and **"Free Preview"** toggle.
- **Integrated Quiz Builder**:
  - Attach multiple-choice quizzes to any course track.
  - Define custom passing scores, question prompts, option lists, correct answer indexes, and answer explanations.
- **Enrolled Learner Progress Tracker (`/dashboard/instructor/courses/[id]/progress`)**:
  - View students enrolled in each course, their current progress percentage, and completion status.
- **Course Lifecycle Management**: Edit syllabi, update metadata, or delete course tracks with confirmation modals.

---

### 4. Content Manager & Editorial Studio

Designed for editorial leads and content quality managers:
- **Manager Dashboard (`/dashboard/manager`)**:
  - High-level content operations KPIs: *Course Catalog*, *Total Articles*, *Published Blogs*, and *Editorial Drafts*.
  - Quick action studios for Course Management and Blog Publishing.
- **Editorial Blog Studio (`/dashboard/manager/blogs`)**:
  - Markdown editor with live preview side-by-side.
  - Cover image upload with direct **ImgBB Cloud CDN integration**.
  - Category selector (*Web Development, Career & Advice, Tutorials, Tech News, Student Success*).
  - Estimated reading time calculator.
  - Draft vs Published toggle with date timestamps.
  - Full CRUD: Create, edit, preview, and delete published articles.
- **Platform-Wide Course Governance (`/dashboard/manager/courses`)**:
  - Oversight across all course tracks, author assignments, and curriculum updates.

---

### 5. System Administrator Console

The central command center for enterprise administration:
- **Admin Dashboard (`/dashboard/admin`)**:
  - Platform-wide statistics: *Total Registered Users*, *Total Enrollments*, *Total Courses*, and *Total Articles*.
  - Real-time user role breakdown (*Students, Instructors, Managers, Administrators*).
- **User & Role Governance (`Users & Roles Tab`)**:
  - Searchable, paginated table of all registered users.
  - Dynamic **Role Reassignment Dropdown**: Instantly promote or change any user's role (*Student ↔ Instructor ↔ Content Manager ↔ Admin*) with real-time API persistence.
  - User account deletion with safeguard preventing admins from deleting their own active account.
- **Universal Course & Blog Moderation**:
  - Global course catalog table with one-click deletion and moderation.
  - Global blog post moderation table with publication status toggling and removal.

---

## 🛠️ Tech Stack & Architecture

### Frontend Architecture
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `16.3.3` | React Framework (App Router, Server & Client Components) |
| **React** | `19.2.8` | UI Library |
| **Tailwind CSS** | `v4.0` | Modern Utility-First Styling System |
| **Lucide React** | `^1.34.0` | Comprehensive UI Icon Library |
| **next-themes** | `^0.4.6` | Dark / Light Theme switching with hydration protection |
| **react-markdown** | `^10.1.0` | Markdown lecture notes & article renderer |
| **remark-gfm** | `^4.0.1` | GitHub Flavored Markdown plugin |
| **canvas-confetti** | `^1.9.4` | Interactive particle celebration on quiz completion |
| **js-cookie** | `^3.0.8` | Client-side cookie management for authentication |

### Backend Architecture
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Strapi CMS** | `5.52.1` | Headless CMS Engine with REST API endpoints |
| **Database** | PostgreSQL / SQLite | Relational database engine |
| **Users-Permissions** | `@strapi/plugin-users-permissions` | Role-based authentication & JWT token generation |
| **Node.js** | `>=20.0.0 <=26.x.x` | Runtime Environment |

### Cloud Services & CDNs
| Service | Role |
| :--- | :--- |
| **Vercel** | Production Edge Hosting for Next.js Frontend |
| **Railway** | Production Container Hosting for Strapi Backend & PostgreSQL Database |
| **ImgBB API** | Cloud CDN image hosting for blog covers & thumbnails |

---

## 💻 Local Installation & Setup Guide

Follow this step-by-step guide to run both the **Strapi Backend** and **Next.js Frontend** locally on your machine.

### Prerequisites
- **Node.js**: `v20.x` or higher installed ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.x` or higher
- **Git**: Installed on your system

---

### 1. Clone Repository

```bash
git clone https://github.com/Ahsanul-Islam-083/SkillFlow--Learning-Management-System-.git
cd "SkillFlow (Learning Management System)"
```

---

### 2. Backend Setup (Strapi v5)

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file in the `Backend/` folder:
   ```bash
   cp .env.example .env
   ```

   Configure the `.env` file with secure random secrets:
   ```env
   HOST=0.0.0.0
   PORT=1337

   # Secrets (generate random strings or use sample values for local development)
   APP_KEYS="skillflow_key_1,skillflow_key_2,skillflow_key_3,skillflow_key_4"
   API_TOKEN_SALT="skillflow_api_token_salt_local_dev"
   ADMIN_JWT_SECRET="skillflow_admin_jwt_secret_local_dev"
   TRANSFER_TOKEN_SALT="skillflow_transfer_token_salt_local"
   JWT_SECRET="skillflow_users_jwt_secret_local_dev"
   ENCRYPTION_KEY="skillflow_encryption_key_local_dev"

   # Database Client (SQLite for effortless local development, or postgres)
   DATABASE_CLIENT=sqlite
   DATABASE_FILENAME=.tmp/data.db
   ```

4. Start the Strapi development server:
   ```bash
   npm run develop
   ```

5. Open [http://localhost:1337/admin](http://localhost:1337/admin) in your browser and register your primary **Super Admin** account.

---

### 3. Backend Permissions & Roles Configuration

To enable the frontend to communicate with Strapi smoothly, configure the role permissions in the Strapi Admin Panel:

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**.
2. Configure **Public** role (for unauthenticated visitors):
   - `Course`: `find`, `findOne`
   - `Lesson`: `find`, `findOne`
   - `Quiz`: `find`, `findOne`
   - `Blog`: `find`, `findOne`
3. Configure **Authenticated** role (for logged-in users):
   - `Course`: `find`, `findOne`, `create`, `update`, `delete`
   - `Lesson`: `find`, `findOne`, `create`, `update`, `delete`
   - `Quiz`: `find`, `findOne`, `create`, `update`, `delete`
   - `Quiz-submission`: `find`, `findOne`, `create`
   - `Enrollment`: `find`, `findOne`, `create`, `update`, `delete`
   - `Blog`: `find`, `findOne`, `create`, `update`, `delete`
   - `User`: `me`, `find`, `update`
4. Click **Save**.

---

### 4. Frontend Setup (Next.js 16)

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env.local` file in the `frontend/` folder:
   ```env
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   NEXT_PUBLIC_API_URL=http://localhost:1337/api
   NEXT_PUBLIC_IMGBB_API_KEY=262dcda3b2740b8e1009a4f1c1a3ee8f
   ```

   > **Note:** To point the frontend to the live cloud API instead of a local Strapi instance, simply change `NEXT_PUBLIC_STRAPI_URL` to `https://skillflow-learning-management-system-production.up.railway.app`.

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to experience SkillFlow LMS!

---

## 🔑 Environment Variables Reference

### Frontend Environment Variables (`frontend/.env.local`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_STRAPI_URL` | Base URL of the Strapi Backend server | `http://localhost:1337` or `https://skillflow-learning-management-system-production.up.railway.app` |
| `NEXT_PUBLIC_API_URL` | Base REST API endpoint | `http://localhost:1337/api` |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Free ImgBB API key for blog cover uploads | `your_imgbb_api_key` |

### Backend Environment Variables (`Backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `HOST` | Server host binding | `0.0.0.0` |
| `PORT` | Server port | `1337` |
| `APP_KEYS` | Array of session signature secrets | `key1,key2` |
| `API_TOKEN_SALT` | Salt used to generate API tokens | Random 32+ char string |
| `ADMIN_JWT_SECRET` | Secret used for Strapi Admin JWTs | Random 32+ char string |
| `TRANSFER_TOKEN_SALT`| Salt for data transfer tokens | Random 32+ char string |
| `JWT_SECRET` | Secret for Users & Permissions JWT | Random 32+ char string |
| `DATABASE_CLIENT` | Database engine (`sqlite` or `postgres`) | `sqlite` |
| `DATABASE_URL` | Full connection string (when using PostgreSQL) | `postgres://user:pass@host:5432/dbname` |

---

## 🗂️ Project Directory Structure

```
SkillFlow (Learning Management System)/
├── README.md                            # Comprehensive Platform Documentation
├── Backend/                             # Strapi v5 Headless CMS Backend
│   ├── config/                          # Server, database, admin & middleware configs
│   │   ├── admin.js
│   │   ├── api.js
│   │   ├── database.js                  # PostgreSQL & SQLite dynamic database connector
│   │   ├── middlewares.js               # CORS & security headers
│   │   └── server.js
│   ├── src/
│   │   ├── api/                         # REST API Endpoints & Content-Type Schemas
│   │   │   ├── blog/                    # Blog articles schema & controllers
│   │   │   ├── course/                  # Course tracks schema & controllers
│   │   │   ├── enrollment/              # Student enrollment records & progress
│   │   │   ├── lesson/                  # Sequential video lectures & content
│   │   │   ├── quiz/                    # Timed MCQ assessments & questions
│   │   │   └── quiz-submission/         # Student quiz attempts & graded scores
│   │   ├── components/
│   │   │   └── quiz-elements/           # Repeatable MCQ Question components
│   │   ├── extensions/
│   │   │   └── users-permissions/       # Custom /users/me endpoint with role population
│   │   └── index.js                     # Bootstrap proxy settings
│   ├── package.json
│   └── .env.example
│
└── frontend/                            # Next.js 16 (React 19) App Router Application
    ├── public/                          # Static assets, icons, and logos
    ├── src/
    │   ├── app/                         # App Router Pages & Layouts
    │   │   ├── layout.js                # Root layout with ThemeProvider & AuthProvider
    │   │   ├── page.js                  # Landing page (Hero, Features, Top Courses, Blogs)
    │   │   ├── about/                   # About Us & Interactive FAQ page
    │   │   ├── login/                   # Authentication sign-in
    │   │   ├── register/                # Learner account registration
    │   │   ├── profile/                 # Profile management & password update
    │   │   ├── courses/                 # Public course catalog
    │   │   │   ├── page.jsx             # Searchable catalog with category & level filters
    │   │   │   └── [slug]/              # Course detail overview
    │   │   │       ├── page.jsx         # Course syllabus, free preview & enroll CTA
    │   │   │       ├── learn/page.jsx   # Distraction-free video learning player
    │   │   │       └── quiz/[quizId]/   # Timed MCQ test player & results review
    │   │   ├── blogs/                   # Public publication & engineering guides
    │   │   │   ├── page.jsx             # Blog grid with reading time & tags
    │   │   │   └── [slug]/page.jsx      # Markdown article reader with author bio
    │   │   └── dashboard/               # Role-Guarded Dashboards
    │   │       ├── layout.jsx           # Dynamic role-aware sidebar navigation layout
    │   │       ├── student/page.jsx     # Student learning workspace & metrics
    │   │       ├── instructor/          # Instructor authoring studio & course builder
    │   │       ├── manager/             # Editorial studio & blog publisher
    │   │       └── admin/page.jsx       # Admin command center & RBAC role switcher
    │   ├── components/                  # Modular Component Architecture
    │   │   ├── common/                  # Modals, badges, progress bars, Markdown renderer
    │   │   ├── courses/                 # Course cards, grids, and live filter bars
    │   │   ├── dashboard/               # Stat cards, banners, and admin tables
    │   │   ├── home/                    # Hero section, feature grids, role CTAs
    │   │   └── layout/                  # Navbar, footer, and theme toggle button
    │   ├── context/
    │   │   └── AuthContext.jsx          # Role normalization, login, register, OAuth state
    │   └── lib/
    │       ├── api.js                   # Unified Strapi API client with JWT support
    │       ├── imgbb.js                 # ImgBB image upload utility
    │       └── utils.js                 # Tailwind class merging helper (clsx + twMerge)
    ├── package.json
    └── next.config.mjs
```

---

## 📡 Core API Endpoints

The Strapi backend exposes a unified RESTful API:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/local` | Authenticate user with identifier and password | No |
| `POST` | `/api/auth/local/register` | Register new student account | No |
| `GET` | `/api/users/me?populate=role` | Retrieve current user profile with assigned role | Yes (Bearer) |
| `POST` | `/api/auth/change-password` | Update account password | Yes (Bearer) |
| `GET` | `/api/courses?populate=*` | List all available course tracks | No |
| `POST` | `/api/courses` | Create new course track | Yes (Instructor/Manager/Admin) |
| `PUT` | `/api/courses/:id` | Update existing course syllabus or metadata | Yes (Instructor/Manager/Admin) |
| `DELETE`| `/api/courses/:id` | Delete course track | Yes (Instructor/Manager/Admin) |
| `GET` | `/api/enrollments` | List user enrollments with progress data | Yes (Bearer) |
| `POST` | `/api/enrollments` | Enroll user in a course track | Yes (Bearer) |
| `PUT` | `/api/enrollments/:id` | Sync lesson completion & course progress | Yes (Bearer) |
| `POST` | `/api/quiz-submissions` | Submit quiz attempt and store score result | Yes (Bearer) |
| `GET` | `/api/blogs?populate=*` | List all published blog articles | No |
| `POST` | `/api/blogs` | Create new blog post with Markdown content | Yes (Manager/Admin) |
| `PUT` | `/api/users/:id` | Update user role (RBAC assignment) | Yes (Admin) |
| `DELETE`| `/api/users/:id` | Delete user account | Yes (Admin) |

---

## 🚀 Production Deployment Guide

### Backend Deployment (Railway)
1. Link your GitHub repository to [Railway](https://railway.app/).
2. Provision a **PostgreSQL** database instance on Railway.
3. Configure the backend service root directory to `/Backend`.
4. Add the required environment variables:
   - `DATABASE_CLIENT=postgres`
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   - `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET`, `ENCRYPTION_KEY`
5. Railway will automatically build and expose the Strapi CMS with SSL.

### Frontend Deployment (Vercel)
1. Import your GitHub repository to [Vercel](https://vercel.com/).
2. Set the Root Directory to `frontend`.
3. Add environment variables:
   - `NEXT_PUBLIC_STRAPI_URL=https://skillflow-learning-management-system-production.up.railway.app`
   - `NEXT_PUBLIC_API_URL=https://skillflow-learning-management-system-production.up.railway.app/api`
   - `NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key`
4. Deploy! Vercel handles automated CI/CD builds on every git push.

---

## 📄 License & Credits

- **Author**: [Ahsanul Islam](https://github.com/Ahsanul-Islam-083)
- **Organization**: CPS Academy
- **License**: MIT License — open for academic, personal, and commercial learning applications.

---

<div align="center">

**⭐ If you find this project helpful, please consider starring the repository! ⭐**

[Back to Top ↑](#-skillflow-lms--enterprise-learning-management-system)

</div>
