# A to Z Automation — Backend API

REST API for A to Z Automation platform built with NestJS.

## 🚀 Live API
[course-platform-api-production-a92a.up.railway.app](https://course-platform-api-production-a92a.up.railway.app)

## 🛠️ Tech Stack
- NestJS
- TypeScript
- PostgreSQL (Supabase)
- Prisma ORM
- JWT Authentication
- Stripe
- Supabase Storage

## ✨ API Endpoints
- POST /auth/register — Register
- POST /auth/login — Login
- GET /courses — Get all courses
- POST /courses — Create course (Admin)
- POST /orders/checkout — Stripe checkout
- POST /upload/video/:courseId — Upload video
- POST /upload/pdf/:courseId — Upload PDF
- GET /comments/lesson/:lessonId — Get comments

## 🚦 Getting Started
```bash
npm install
npm run start:dev
🔑 Environment Variables (.env)
DATABASE_URL=
JWT_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PORT=3001
🚀 Deployment
Deployed on Railway