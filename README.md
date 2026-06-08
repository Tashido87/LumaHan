# LumaHan

Private Chinese learning web app for HSK 1 to HSK 5.

## What Is Built

- Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui primitives
- Full Stage 1 static UI shell with mock HSK content
- Routes: auth landing, dashboard, HSK path, lessons, practice, review, listening, speaking, character detail, grammar, vocabulary, notes, AI tutor, analytics, daily challenge, admin, settings
- Firebase client boundary, Firestore/Storage rules, indexes, seed data example
- Cloud Functions scaffolding for Gemini JSON features and Google Cloud Text-to-Speech audio caching

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Setup

Copy `.env.example` to `.env.local` and fill Firebase web config:

```bash
cp .env.example .env.local
```

Client-visible Firebase keys use `NEXT_PUBLIC_FIREBASE_*`. Keep `GEMINI_API_KEY`, `GOOGLE_CLOUD_TTS_KEY`, service account paths, and `ADMIN_EMAIL` server-only.

## Firebase Setup

1. Create a Firebase project.
2. Enable Google sign-in in Firebase Authentication.
3. Create Firestore in native mode.
4. Enable Firebase Storage.
5. In Firebase Console > Authentication > Settings > Authorized domains, add:
   - `localhost`
   - `lumahan-10d75.firebaseapp.com`
   - `lumahan.vercel.app`
   - any future custom production domain
6. Copy `.firebaserc.example` to `.firebaserc` and set your project ID.
7. Deploy rules and indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Admin assignment is server-controlled by `ensureUserProfile`. The first signed-in user becomes admin, or set `ADMIN_EMAIL` for a configured admin address.

The Firebase config for `lumahan-10d75` is already represented by `.env.local` for local development. Add the same `NEXT_PUBLIC_FIREBASE_*` values to your Vercel project environment variables.

## Cloud Functions

Install and build functions:

```bash
npm --prefix functions install
npm --prefix functions run build
```

Set secrets/params before deploying:

```bash
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set GOOGLE_CLOUD_TTS_KEY
```

For this scaffold, `ADMIN_EMAIL` is read as a Functions parameter/env value. Put `ADMIN_EMAIL=you@example.com` in `functions/.env` for local emulator use and set the same parameter in your Firebase deployment workflow if you want a configured admin instead of first-user bootstrap.

Deploy:

```bash
firebase deploy --only functions
```

## Seed Data

`data/seed/hsk-real-old-1-5.json` contains the real classic HSK 1-5 vocabulary seed generated from the MIT-licensed Complete HSK Vocabulary dataset.

Generate/update it with:

```bash
npm run seed:generate
```

The admin dashboard imports this seed in Firestore-safe chunks.

## Manual Configuration Remaining

- Add the deployed domain to Firebase Auth authorized domains.
- Add the same Firebase/Gemini environment variables in Vercel.
- Set Firebase Functions secrets for Gemini and Text-to-Speech before deploying functions.
- Attach stroke-order asset URLs or reference URLs in admin content.
- Import/admin-review grammar points and base example sentences.
