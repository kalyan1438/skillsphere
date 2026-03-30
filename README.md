# SkillSphere Academy — Full Stack App

## Project Structure
```
skillsphere/
├── backend/    → Node.js + Express + MongoDB (MVC)
└── frontend/   → React + TypeScript + Tailwind CSS
```

---

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: fill MONGO_URI, JWT_SECRET, SMTP credentials
npm run seed      # Creates admin + sample data
npm run dev       # Runs on http://localhost:5000
```

**Default Admin Credentials (after seed):**
- Email: `admin@skillsphere.in`
- Password: `Admin@1234`

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev       # Runs on http://localhost:5173
```

---

## Features

### Public Site
- Hero, About, Courses, Faculty, Announcements, Testimonials, Contact sections
- Course registration with **OTP email verification**
- Fully responsive (mobile + desktop)

### Admin Panel (`/admin`)
- JWT protected login
- Dashboard with live stats
- Manage Courses (Add / Edit / Delete)
- Manage Faculty (Add / Edit / Delete)
- View & manage Student Registrations (Confirm / Cancel)
- Post Announcements (with optional email blast)

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/admin/login` | ❌ | Admin login |
| GET  | `/api/admin/dashboard` | ✅ | Dashboard stats |
| GET  | `/api/courses` | ❌ | Public courses list |
| POST | `/api/courses` | ✅ | Create course |
| PUT  | `/api/courses/:id` | ✅ | Update course |
| DELETE | `/api/courses/:id` | ✅ | Remove course |
| GET  | `/api/faculty` | ❌ | Public faculty list |
| POST | `/api/faculty` | ✅ | Add faculty |
| PUT  | `/api/faculty/:id` | ✅ | Update faculty |
| DELETE | `/api/faculty/:id` | ✅ | Remove faculty |
| GET  | `/api/announcements` | ❌ | Public announcements |
| POST | `/api/announcements` | ✅ | Create + email blast |
| POST | `/api/registrations/request` | ❌ | Step 1: Send OTP |
| POST | `/api/registrations/verify-otp` | ❌ | Step 2: Verify & register |
| POST | `/api/registrations/resend-otp` | ❌ | Resend OTP |
| GET  | `/api/registrations` | ✅ | All registrations (admin) |
| PATCH | `/api/registrations/:id/status` | ✅ | Update status |

---

## Gmail SMTP Setup
1. Enable 2-Step Verification on your Google account
2. Go to: Google Account → Security → App Passwords
3. Generate a 16-character app password
4. Use that as `SMTP_PASS` in `.env` (NOT your real Gmail password)

---

## Deployment

### Backend → Railway / Render
1. Push backend folder to GitHub
2. Connect to Railway or Render
3. Set all environment variables
4. Deploy — it uses `npm start` (node server.js)

### Frontend → Vercel
1. Push frontend folder to GitHub
2. Connect to Vercel
3. Set `VITE_API_URL=https://your-backend.railway.app/api`
4. Deploy

---

## Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Axios, React Router v6, React Hot Toast
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Nodemailer, bcryptjs
"# skillsphere" 
