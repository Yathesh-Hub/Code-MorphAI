# CodeMorph AI

AI-powered code translation and analysis platform using Google Gemini.

## Project Structure

```
codemorph-ai/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite SPA
├── database/         # SQL schema
└── README.md
```

## Quick Start

### 1. Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `database/schema.sql`
3. Copy your project URL and keys from Settings → API

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `JWT_SECRET` | Random string for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `FRONTEND_URL` | Frontend URL for CORS |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login user |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/dashboard` | Yes | Dashboard stats |
| POST | `/api/translate` | Yes | Translate code |
| POST | `/api/explain` | Yes | Explain code |
| POST | `/api/analyze` | Yes | Analyze code |
| POST | `/api/issues` | Yes | Detect bugs |
| GET | `/api/history` | Yes | Get history |
| DELETE | `/api/history/:id` | Yes | Delete translation |

## Deployment

### Backend → Render

1. Push backend to a GitHub repo
2. Create a new Web Service on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env.example`

### Frontend → Vercel

1. Push frontend to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Set `VITE_API_URL` to your Render backend URL
4. Deploy

## Getting a Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click "Get API key" → "Create API key"
3. Copy key to `GEMINI_API_KEY` in `.env`
