import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_BASE =
  "https://raw.githubusercontent.com/drkameleon/complete-hsk-vocabulary/main";
const SOURCE_REPO = "https://github.com/drkameleon/complete-hsk-vocabulary";
const OUTPUT = path.join("data", "seed", "hsk-real-old-1-5.json");

const levelDescriptions = {
  1: "Classic HSK 1 foundations: high-frequency beginner words and particles.",
  2: "Classic HSK 2 expansion: daily actions, locations, time, and simple opinions.",
  3: "Classic HSK 3 bridge: travel, work, study, comparisons, and longer sentence building.",
  4: "Classic HSK 4 upper-intermediate vocabulary for explanation and narration.",
  5: "Classic HSK 5 advanced vocabulary for reading, discussion, and abstract topics.",
};

const posLabels = {
  a: "adjective",
  ad: "adverbial adjective",
  ag: "adjective morpheme",
  an: "nominal adjective",
  b: "non-predicate adjective",
  c: "conjunction",
  d: "adverb",
  e: "interjection",
  f: "directional locality",
  g: "morpheme",
  h: "prefix",
  i: "idiom",
  j: "abbreviation",
  k: "suffix",
  l: "fixed expression",
  m: "numeral",
  n: "noun",
  ng: "noun morpheme",
  nr: "personal name",
  ns: "place name",
  nt: "organization name",
  nz: "proper noun",
  p: "preposition",
  q: "classifier",
  r: "pronoun",
  s: "space word",
  t: "time word",
  u: "auxiliary",
  v: "verb",
  vd: "verb as adverbial",
  vn: "nominal verb",
  w: "punctuation",
  x: "unclassified",
  y: "modal particle",
  z: "descriptive",
};

const wordsPerLesson = {
  1: 15,
  2: 15,
  3: 20,
  4: 25,
  5: 25,
};

function slugNumber(level, index) {
  return `hsk${level}-${String(index + 1).padStart(4, "0")}`;
}

function primaryForm(entry) {
  return entry.forms?.[0] ?? {};
}

function meaningText(form) {
  return Array.isArray(form.meanings) && form.meanings.length > 0
    ? form.meanings.join("; ")
    : "needs review";
}

function partOfSpeech(entry) {
  const codes = Array.isArray(entry.pos) ? entry.pos : [];
  return codes.map((code) => posLabels[code] ?? code).join(", ") || "needs review";
}

function cleanPinyin(form) {
  return form.transcriptions?.pinyin ?? "";
}

function uniqueById(items) {
  const map = new Map();
  for (const item of items) map.set(item.id, item);
  return [...map.values()];
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

async function main() {
  const hskLevels = [1, 2, 3, 4, 5].map((level) => ({
    id: `hsk${level}`,
    levelNumber: level,
    title: `HSK ${level}`,
    description: levelDescriptions[level],
    order: level,
  }));

  const units = [];
  const lessons = [];
  const vocabulary = [];
  const characterCandidates = [];

  for (const level of [1, 2, 3, 4, 5]) {
    const url = `${SOURCE_BASE}/wordlists/exclusive/old/${level}.json`;
    const entries = await fetchJson(url);
    const levelVocab = entries.map((entry, index) => {
      const id = slugNumber(level, index);
      const form = primaryForm(entry);
      const tags = [`HSK${level}`, "classic-hsk", "real-seed"];
      const pinyin = cleanPinyin(form);
      const traditional = form.traditional ?? entry.simplified;

      if (Array.isArray(entry.pos)) tags.push(...entry.pos.map((code) => `pos:${code}`));
      if (Array.isArray(form.classifiers)) {
        tags.push(...form.classifiers.map((classifier) => `classifier:${classifier}`));
      }

      if ([...entry.simplified].length === 1 && [...traditional].length === 1) {
        characterCandidates.push({
          id: `char-${id}`,
          hskLevel: level,
          simplified: entry.simplified,
          traditional,
          pinyin,
          meaning: meaningText(form),
          radical: entry.radical ?? "",
          components: [],
          strokeCount: 0,
          strokeOrderAssetUrl: "",
          strokeOrderReferenceUrl: "",
          exampleWordIds: [id],
          exampleSentenceIds: [],
          notes:
            "Generated from a single-character vocabulary entry in the Complete HSK Vocabulary dataset. Add stroke-order assets in admin.",
        });
      }

      return {
        id,
        hskLevel: level,
        simplified: entry.simplified,
        traditional,
        pinyin,
        englishMeaning: meaningText(form),
        partOfSpeech: partOfSpeech(entry),
        tags,
        exampleSentenceIds: [],
        relatedCharacterIds:
          [...entry.simplified].length === 1 ? [`char-${id}`] : [],
        difficultyScore: Math.min(
          100,
          Math.max(1, Math.round((level - 1) * 20 + (index / entries.length) * 18))
        ),
        source: "complete-hsk-vocabulary",
        sourceLevel: `old-${level}`,
        frequency: entry.frequency ?? null,
      };
    });

    vocabulary.push(...levelVocab);

    const perLesson = wordsPerLesson[level];
    const lessonChunks = [];
    for (let i = 0; i < levelVocab.length; i += perLesson) {
      lessonChunks.push(levelVocab.slice(i, i + perLesson));
    }

    for (let unitIndex = 0; unitIndex < Math.ceil(lessonChunks.length / 5); unitIndex++) {
      const unitId = `hsk${level}-unit-${String(unitIndex + 1).padStart(2, "0")}`;
      units.push({
        id: unitId,
        hskLevel: level,
        title: `HSK ${level} Unit ${unitIndex + 1}`,
        description: `Real HSK ${level} vocabulary lessons ${unitIndex * 5 + 1}-${Math.min(
          unitIndex * 5 + 5,
          lessonChunks.length
        )}. Grammar and examples should be attached by admin review.`,
        order: unitIndex + 1,
        isLockedByDefault: level > 1 || unitIndex > 0,
      });

      const unitLessonChunks = lessonChunks.slice(unitIndex * 5, unitIndex * 5 + 5);
      unitLessonChunks.forEach((chunk, lessonIndexWithinUnit) => {
        const lessonNumber = unitIndex * 5 + lessonIndexWithinUnit + 1;
        const lessonId = `hsk${level}-lesson-${String(lessonNumber).padStart(3, "0")}`;
        const previousLessonId =
          lessonNumber === 1 && level === 1
            ? null
            : lessonIndexWithinUnit === 0 && unitIndex === 0
              ? `hsk${level - 1}-boss`
              : `hsk${level}-lesson-${String(lessonNumber - 1).padStart(3, "0")}`;

        lessons.push({
          id: lessonId,
          hskLevel: level,
          unitId,
          title: `Vocabulary Set ${lessonNumber}`,
          description: `Learn ${chunk.length} real HSK ${level} vocabulary items with simplified, traditional, pinyin, and English meanings.`,
          order: lessonNumber,
          estimatedMinutes: Math.max(10, Math.round(chunk.length * 1.2)),
          vocabularyIds: chunk.map((item) => item.id),
          grammarIds: [],
          characterIds: chunk.flatMap((item) => item.relatedCharacterIds),
          prerequisiteLessonIds: previousLessonId ? [previousLessonId] : [],
          curriculumStatus: "vocabulary-ready",
        });
      });
    }

    lessons.push({
      id: `hsk${level}-boss`,
      hskLevel: level,
      unitId: `hsk${level}-unit-${String(Math.ceil(lessonChunks.length / 5)).padStart(
        2,
        "0"
      )}`,
      title: `HSK ${level} Boss Review`,
      description: `Cumulative review for HSK ${level}. Add grammar and listening/speaking review templates in admin.`,
      order: lessonChunks.length + 1,
      estimatedMinutes: 30,
      vocabularyIds: levelVocab.slice(-Math.min(50, levelVocab.length)).map((item) => item.id),
      grammarIds: [],
      characterIds: [],
      prerequisiteLessonIds:
        lessonChunks.length > 0
          ? [`hsk${level}-lesson-${String(lessonChunks.length).padStart(3, "0")}`]
          : [],
      curriculumStatus: "review-shell",
    });
  }

  const characters = uniqueById(characterCandidates);
  const seed = {
    metadata: {
      generatedAt: new Date().toISOString(),
      title: "LumaHan real HSK 1-5 seed",
      hskSystem: "Classic HSK 2.0 levels 1-5",
      source: SOURCE_REPO,
      sourceLicense: "MIT",
      sourceFiles: [1, 2, 3, 4, 5].map(
        (level) => `${SOURCE_BASE}/wordlists/exclusive/old/${level}.json`
      ),
      limitations:
        "Vocabulary is sourced from MIT data. Grammar points, stroke order assets, and curated example sentences require admin review/import before being treated as authoritative.",
    },
    hskLevels,
    units,
    lessons,
    vocabulary,
    characters,
    grammarPoints: [],
    exampleSentences: [],
  };

  await mkdir(path.dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, `${JSON.stringify(seed, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        output: OUTPUT,
        levels: hskLevels.length,
        units: units.length,
        lessons: lessons.length,
        vocabulary: vocabulary.length,
        characters: characters.length,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
