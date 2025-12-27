# 🎵 Reverb - Collaborative Music Streaming Platform

## 📋 Table of Contents
1. 📃 [Introduction](#-introduction)
2. ⚙️ [Tech Stack](#-tech-stack)
3. 🔖 [Features](#-features)
4. ⚡ [Quick Start](#-quick-start)
5. 🌏 [Environment Variables](#-environment-variables)

---

## 📃 Introduction

**Reverb** is a collaborative **real-time music streaming web app** built using **Next.js 14 (App Router)**, **TypeScript**, and **Prisma ORM**.  
It lets users:
- 🎧 Create or join live “stream” rooms  
- 🎵 Add YouTube songs to a shared queue  
- 👍 Upvote songs to decide what plays next  
- 🧠 Auto-play the most upvoted songs  

This project showcases **full-stack development**, **authentication with NextAuth**, **database modeling**, and **real-time updates** via polling.  
Built for modern developers who want to experience the blend of **Next.js, Prisma, and OAuth** in a SaaS-style app.

---

## ⚙️ Tech Stack

Frontend:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - ShadCN/UI Components
  - Lucide React Icons
  - React Lite YouTube Embed
  - React Toastify / Sonner

Backend:
  - Next.js API Routes
  - NextAuth.js (Google OAuth)
  - Prisma ORM
  - Zod Validation
  - YouTube Data API

Database:
  - PostgreSQL (via Prisma)
---

## 🔖 Features

🔐 Google Authentication
  → Secure login using Google OAuth via NextAuth.
  → User data stored in PostgreSQL.

🎵 Create & Join Streams
  → Authenticated users can host a stream or join others.

📺 YouTube Song Integration
  → Paste a YouTube link, metadata (title, thumbnail) auto-fetched.

📊 Live Voting System
  → Listeners upvote/downvote songs.
  → Queue reorders dynamically by votes.

⏯️ Auto Play Next
  → Automatically plays the next most upvoted song when one ends.

🕸️ Short Polling
  → Real-time queue refresh every 10 seconds for live updates.

💾 Persistent Data
  → All streams, users, and votes stored in PostgreSQL via Prisma.

🪪 Session Authentication (Hybrid JWT + Cookies)
  → NextAuth issues secure, encrypted session cookies.

🌈 Responsive UI
  → Built with TailwindCSS + ShadCN for a smooth, modern experience.
---
## ⚡ Quick Start
## 🧰 Prerequisites

Ensure you have installed:

Node.js ≥ 18

npm ≥ 9

PostgreSQL database (local or hosted)
```bash
1️⃣ Clone the Repository
git clone https://github.com/SairamChinta/reverb-v0.git
cd reverb

2️⃣ Install Dependencies
npm install

3️⃣ Setup the Database
npx prisma migrate dev

(Optional) open Prisma Studio to inspect DB:

npx prisma studio

4️⃣ Start the App
npm run dev
```
Visit your app at 👉 http://localhost:3001
---
## 🌏 Environment Variables

Create a .env file at the root of your project:
```bash
# Application
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your-random-secret>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/reverb
```