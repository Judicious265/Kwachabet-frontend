# Kwacha Bet Frontend

Next.js 14 frontend for Kwacha Bet — Malawi's sports betting platform.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your backend URL
3. `npm run dev` — opens on http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import repo on vercel.com
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = https://your-backend.onrender.com/api/v1
   - `NEXT_PUBLIC_WS_URL` = wss://your-backend.onrender.com/ws/odds
4. Deploy
