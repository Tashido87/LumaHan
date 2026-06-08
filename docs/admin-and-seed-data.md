# Admin and Seed Data Workflow

## Admin Responsibilities

The admin dashboard is designed to manage:

- HSK levels
- Units
- Lessons
- Vocabulary
- Characters
- Grammar points
- Example sentences
- Stroke-order references or assets
- Lesson order
- Exercise templates
- AI prompt templates

## Stroke Order

Do not scrape stroke-order websites automatically. Store one or both of:

- `strokeOrderAssetUrl`: Firebase Storage URL for an image, GIF, SVG, or video
- `strokeOrderReferenceUrl`: manually entered reference URL

The learner view only displays handwriting/stroke-order instruction.

## Import Shape

Use `data/seed/hsk-real-old-1-5.json` for the real classic HSK 1-5 vocabulary seed. It is generated from the MIT-licensed Complete HSK Vocabulary project:

- Source: https://github.com/drkameleon/complete-hsk-vocabulary
- HSK system: classic HSK 2.0 levels 1-5
- Generated content: HSK levels, units, lessons, vocabulary, and single-character entries
- Not generated as authoritative curriculum: grammar points, stroke-order assets, and base example sentences

Regenerate the seed:

```bash
npm run seed:generate
```

A full curated dataset should keep stable IDs so lessons can link by ID:

```json
{
  "lessons": [
    {
      "id": "hsk1-hello",
      "vocabularyIds": ["ni", "hao"],
      "grammarIds": ["yes-no-ma"],
      "characterIds": ["char-ni", "char-hao"]
    }
  ]
}
```

## Validation Checks

The admin UI is prepared for checks such as:

- Missing pinyin
- Missing traditional form
- Missing examples
- Missing stroke-order references
- AI-generated sentences that are not reviewed
- Unlinked content IDs

## Private Admin Setup

`ensureUserProfile` creates the profile document on first sign-in. Role assignment:

- First signed-in user becomes `admin`.
- A user matching configured `ADMIN_EMAIL` becomes `admin`.
- Everyone else becomes `learner`.

Firestore rules prevent users from self-promoting to admin from the browser.
