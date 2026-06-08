# Firebase Setup

## Collections

- `users/{userId}`: profile, HSK position, XP, streak, role
- `hskLevels/{hskLevelId}`: HSK level metadata
- `units/{unitId}`: unit metadata and ordering
- `lessons/{lessonId}`: lesson metadata and linked content IDs
- `vocabulary/{vocabId}`: simplified, traditional, pinyin, English, examples
- `characters/{characterId}`: radicals, components, stroke-order URLs/assets
- `grammarPoints/{grammarId}`: pattern, explanation, mistakes, examples
- `exampleSentences/{sentenceId}`: Chinese, pinyin, English, audio URL
- `userProgress/{userId}/lessonProgress/{lessonId}`: lesson status and scores
- `userProgress/{userId}/mastery/{itemId}`: item mastery and review scheduling
- `notes/{noteId}`: private notes linked to learning content
- `exerciseResults/{resultId}`: practice results and AI feedback
- `aiSessions/{sessionId}`: summarized AI request/response logs
- `dailyStats/{userId_date}`: XP, accuracy, minutes, streak status

## Rules

`firestore.rules` enforces:

- Authenticated users can read curated learning content.
- Users can only read/write their own progress, notes, exercise results, AI sessions, and stats.
- Admin users can write curriculum content.
- Users cannot self-assign the `admin` role from the client.

Admin role setup is handled by the `ensureUserProfile` Cloud Function.

## Google Sign-In Authorized Domains

If Google sign-in fails with `auth/unauthorized-domain`, add the deployed domain in:

Firebase Console > Authentication > Settings > Authorized domains.

For the current project, include:

- `localhost`
- `lumahan-10d75.firebaseapp.com`
- `lumahan.vercel.app`

This is a Firebase Console setting and cannot be solved by changing the client config alone.

## Storage

`storage.rules` uses:

- `content/**` for admin-managed curriculum assets such as stroke-order images.
- `audio-cache/**` for generated Mandarin audio.
- `users/{userId}/**` for private user-owned files if needed later.

Cloud Functions write cached audio through Admin SDK and return short-lived signed URLs.
