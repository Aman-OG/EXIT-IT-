# 🎓 EX-IT — IT Exit Exam Preparation Platform

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini_%2B_Groq-FF6F00?logo=google&logoColor=white)
![Three.js](https://img.shields.io/badge/3D-Three.js_%26_R3F-black?logo=three.js&logoColor=white)

**A full-stack, gamified learning and exam preparation platform designed to help Information Technology students ace university exit exams.**

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Environment Variables](#-environment-variables) • [Database & Seeding](#-database--seeding) • [API Architecture](#-api-architecture)

</div>

---

## 🌟 Overview

**EX-IT** is an interactive, all-in-one preparation ecosystem built specifically for computer science and IT undergraduates gearing up for their National IT Exit Examination. It pairs comprehensive course materials and timed mock exams with game mechanics (XP, streaks, freeze shields, unlocked badges) and social features (friends, leaderboards, notifications, activity feeds) to keep students motivated and exam-ready.

---

## ✨ Key Features

### 📚 1. Interactive Course & Study Hub
- **Chapter-by-Chapter PDF Reader**: Built-in reader with custom themes (Light, Dark, Sepia Study, Eye Protection), full text search, and zoom controls.
- **Embedded Lecture Videos**: Curated YouTube video tutorials mapped to each syllabus topic.
- **Integrated Rich-Text Notes**: Take persistent study notes directly on each chapter.
- **Visual Roadmap**: Track module-by-module completion across all university IT courses.

### ⏱️ 2. Quizzes & Timed Mock Exam Simulator
- **Course Chapter Quizzes**: Practice quizzes with instant score breakdowns, timers, and detailed explanations.
- **Mock Exam Simulation**: Real-life exam conditions featuring full question pools, strict countdown timers, question bookmarking, review filters, and historical performance charts.
- **AI-Powered Explanations**: Instant conceptual clarity powered by Google Gemini AI with seamless Groq fallback.
- **Question Error Reporting**: In-app reporting for question ambiguities with an administrator resolution workflow.

### 🎮 3. Gamification & Rewards
- **Streaks & Streak Freezes**: Build daily study streaks with streak freeze protections earned every 7 days.
- **XP Points & Levels**: Earn XP through reading chapters, answering quiz questions, and completing mock exams.
- **8 Achievement Badges**: Unlock milestones such as *The Initiator*, *Flawless Victory*, *Marathon Reader*, *Night Owl*, and *Exam Ready*.
- **Interactive 3D Trophy Room**: Built using Three.js and React Three Fiber to showcase your unlocked achievements.
- **Global & Friend Leaderboards**: Compete on Points, Accuracy, Streaks, and Total Quizzes Solved.

### 👥 4. Social Learning & Friend Network
- **User Discovery & Requests**: Search for classmates by name or email with instant friend requests.
- **Mutual Friends & Mini-Profiles**: Hover over any student on the leaderboard or search results to view their stats, badges, and mutual connections.
- **Friends-Only Leaderboard**: Filter rankings strictly among your study circle.
- **Real-Time Notification Feed**: In-app bell with categorized notifications (Friend Requests, Streak Warnings, Trophy Unlocks, Daily Goal Reminders).

### 🃏 5. 3D Flashcards (Spaced Repetition)
- **Interactive 3D Flipping Cards**: Review high-yield terminology and definitions.
- **Self-Assessment Rating**: Mark cards as *Easy*, *Medium*, or *Hard* to prioritize review.

### 🛡️ 6. Admin Control Center & Analytics
- **Student Account Auditing**: Inspect enrolled students with their custom avatars, scores, and activity status.
- **Deep Performance Analytics**: Track completion rates per chapter, average quiz scores, and top 5 hardest questions by error percentage.
- **Content & Quiz Management**: Create, edit, and delete courses, chapters, questions, and CSV import question banks in bulk.
- **Feedback Portal**: Review student-submitted reviews, suggestions, and bug reports.
- **Target Exam Scheduler**: Configure the global network exit exam date and countdown timer.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS + TailwindCSS 3.4 (with dynamic theme variables)
- **Icons**: Lucide React
- **Charts & Data Viz**: Recharts
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **Rich Text & PDF**: React-PDF, pdfjs-dist, React-Quill
- **Audio & FX**: Use-Sound, Canvas Confetti

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express 5
- **Database**: PostgreSQL (Cloud Supabase / Local PostgreSQL) with `pg` connection pool
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies + Authorization Bearer header support + Google OAuth 2.0
- **File Uploads**: Multer with static asset serving
- **Task Scheduling**: Node-Cron for daily reminders and streak auditing
- **Email Delivery**: Nodemailer (SMTP)
- **AI Integrations**: `@google/generative-ai` (Gemini 2.5 Flash / Pro) + `groq-sdk` (Llama 3.3)

---

## 📂 Project Structure

```text
EXIT-IT-/
├── client/                     # Frontend React (Vite) Application
│   ├── public/                 # Static assets and icons
│   ├── src/
│   │   ├── api/                # Axios instance & interceptors
│   │   ├── components/         # Reusable UI (Navbar, NotificationBell, Card, Skeletons)
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── pages/              # Main routes (Dashboard, Courses, Quizzes, ExamMode, Profile...)
│   │   │   └── admin/          # Admin pages (UserManagement, AdminAnalytics, Feedback...)
│   │   ├── utils/              # Avatar resolvers, sounds, helpers
│   │   ├── App.jsx             # Route definitions & layout wrappers
│   │   ├── index.css           # Global tokens & theme styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Node.js Express API
│   ├── src/
│   │   ├── admin/              # Admin stats, user deletion, course analytics
│   │   ├── ai/                 # Gemini & Groq AI tutoring endpoints
│   │   ├── analytics/          # Dashboards, radar data, leaderboard queries
│   │   ├── config/             # PostgreSQL database pool (`db.js`)
│   │   ├── courses/            # Courses CRUD
│   │   ├── exams/              # Mock exam simulation & question reporting
│   │   ├── feedback/           # Feedback submission & admin review
│   │   ├── flashcards/         # Flashcards CRUD & confidence tracking
│   │   ├── friends/            # Friend request management & stats
│   │   ├── materials/          # Chapter materials & PDF uploads
│   │   ├── middleware/         # Auth (`protect`, `adminOnly`) & file middleware
│   │   ├── notes/              # User notes per chapter
│   │   ├── notifications/      # Notification triggers & user preferences
│   │   ├── progress/           # Study session timers, certificate generation
│   │   ├── quizzes/            # Quiz attempts, grading, CSV imports
│   │   ├── services/           # Background cron jobs & email delivery
│   │   ├── settings/           # System exam date and global settings
│   │   ├── users/              # Auth, profile updating, avatars, streak tracking
│   │   ├── videos/             # Curated YouTube video lecture routes
│   │   ├── app.js              # Express app setup & middleware
│   │   └── server.js           # HTTP listener initialization
│   ├── uploads/                # User uploaded profile pictures & PDFs
│   ├── database.sql            # Core database schema
│   ├── package.json
│   └── index.js
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn**
- **PostgreSQL**: Local PostgreSQL instance or a hosted [Supabase](https://supabase.com) database.

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/EXIT-IT.git
cd EXIT-IT
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
# Server
PORT=5005
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:5173

# PostgreSQL Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/exit_it
DB_USER=postgres
DB_HOST=localhost
DB_NAME=exit_it
DB_PASSWORD=your_password
DB_PORT=5432

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Tutoring Keys (Optional)
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
YOUTUBE_API_KEY=your_youtube_api_key

# Email SMTP (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

Initialize the database schema:
```bash
# Execute schema in your database
node patch_db_schema.js
node migrate_avatar_bio.js
```

Start the backend server:
```bash
npm run dev
# Server will run on http://localhost:5005
```

---

### 3. Frontend Setup
Open a new terminal tab and configure the client:
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5005
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the Vite development server:
```bash
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 🗄️ Database & Seeding

The repository comes with seed scripts to populate courses, syllabus materials, and past IT exit exam questions:

```bash
cd server

# Seed course quizzes and real exam questions
node seed_all_course_quizzes.js
node seed_dccn_quizzes.js
node seed_oop_quizzes.js
node seed_sna_quizzes.js

# Verify database quizzes
node verify_all_quizzes.js
```

---

## 📡 API Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register a new student account | Public |
| `POST` | `/api/users/login` | User login & JWT issuance | Public |
| `GET` | `/api/users/me` | Fetch authenticated profile | Protected |
| `PUT` | `/api/users/profile` | Update user name, bio, and avatar | Protected |
| `GET` | `/api/analytics/dashboard` | Combined summary metrics & countdown | Protected |
| `GET` | `/api/analytics/leaderboard` | Top students ranked by score / streak | Protected |
| `GET` | `/api/courses` | List all available IT courses | Protected |
| `GET` | `/api/quizzes/course/:id` | Fetch practice quizzes for a course | Protected |
| `POST` | `/api/quizzes/:id/submit` | Grade quiz attempt and award XP | Protected |
| `GET` | `/api/exams/mock` | Generate randomized 100-question mock exam | Protected |
| `GET` | `/api/friends` | List accepted friends | Protected |
| `POST` | `/api/friends/request` | Send friend invitation | Protected |
| `GET` | `/api/notifications` | Fetch user notification inbox | Protected |
| `GET` | `/api/admin/users` | List all enrolled students with avatars | Admin Only |
| `GET` | `/api/admin/analytics/courses`| Deep-dive course analytics | Admin Only |

---

## 🎨 Theme Support

EX-IT includes four visual reading modes:
1. **Light Mode**: High-contrast, clean academic theme.
2. **Dark Mode**: Sleek OLED-friendly dark palette with glassmorphic cards.
3. **Study (Sepia) Mode**: Warm sepia tones engineered to minimize eye strain during long reading sessions.
4. **Eye Protection Mode**: Reduced blue-light palette for late-night exam prep.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for university scholars aiming for IT Exit Exam excellence.</sub>
</div>
