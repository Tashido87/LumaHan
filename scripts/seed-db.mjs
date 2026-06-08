import fs from 'fs';
import path from 'path';

const projectId = 'lumahan-10d75';
const userId = 'gu5COfXMKtdcH1AhcxeXMD0l22A3';
const userEmail = 'herozboy@gmail.com';

function toFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === 'string') {
    return { stringValue: value };
  }
  if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      return { integerValue: String(value) };
    }
    return { doubleValue: value };
  }
  if (typeof value === 'boolean') {
    return { booleanValue: value };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(toFirestoreValue)
      }
    };
  }
  if (typeof value === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function toFirestoreFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    fields[k] = toFirestoreValue(v);
  }
  return fields;
}

async function main() {
  const configPath = '/Users/tashido/.config/configstore/firebase-tools.json';
  if (!fs.existsSync(configPath)) {
    throw new Error('Config file not found');
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const accessToken = config.tokens?.access_token;
  if (!accessToken) {
    throw new Error('Access token not found in config');
  }

  // 1. Update user role to admin
  console.log(`Setting user ${userId} (${userEmail}) as admin...`);
  const userUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${userId}?updateMask.fieldPaths=role`;
  const userUpdateRes = await fetch(userUrl, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `projects/${projectId}/databases/(default)/documents/users/${userId}`,
      fields: {
        role: { stringValue: 'admin' }
      }
    })
  });

  if (!userUpdateRes.ok) {
    throw new Error(`Failed to update user role: ${await userUpdateRes.text()}`);
  }
  console.log('User role updated to admin successfully.');

  // 2. Write admin bootstrap document
  console.log('Creating admin/bootstrap document...');
  const bootstrapUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admin/bootstrap`;
  const bootstrapRes = await fetch(bootstrapUrl, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `projects/${projectId}/databases/(default)/documents/admin/bootstrap`,
      fields: {
        firstAdminUserId: { stringValue: userId },
        adminEmail: { stringValue: userEmail },
        createdAt: { timestampValue: new Date().toISOString() }
      }
    })
  });

  if (!bootstrapRes.ok) {
    throw new Error(`Failed to create admin bootstrap doc: ${await bootstrapRes.text()}`);
  }
  console.log('Admin bootstrap document created.');

  // 3. Load HSK 1-5 seed data
  console.log('Loading HSK 1-5 seed data...');
  const seedDataPath = './data/seed/hsk-real-old-1-5.json';
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

  const collections = [
    { name: 'hskLevels', items: seedData.hskLevels || [] },
    { name: 'units', items: seedData.units || [] },
    { name: 'lessons', items: seedData.lessons || [] },
    { name: 'vocabulary', items: seedData.vocabulary || [] },
    { name: 'characters', items: seedData.characters || [] },
    { name: 'grammarPoints', items: seedData.grammarPoints || [] },
    { name: 'exampleSentences', items: seedData.exampleSentences || [] }
  ];

  for (const col of collections) {
    const { name, items } = col;
    if (items.length === 0) {
      console.log(`Collection ${name} is empty. Skipping.`);
      continue;
    }

    console.log(`Importing ${items.length} items to collection '${name}'...`);

    // Group writes in chunks of 400
    const chunkSize = 400;
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const writes = chunk.map(item => {
        const docName = `projects/${projectId}/databases/(default)/documents/${name}/${item.id}`;
        return {
          update: {
            name: docName,
            fields: toFirestoreFields(item)
          }
        };
      });

      const commitUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit`;
      const commitRes = await fetch(commitUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ writes })
      });

      if (!commitRes.ok) {
        throw new Error(`Failed committing batch to '${name}': ${await commitRes.text()}`);
      }

      console.log(`  Progress: ${Math.min(i + chunk.length, items.length)}/${items.length}`);
    }
  }

  console.log('All real HSK data seeded successfully!');
}

main().catch(err => {
  console.error('Seeding script failed:', err);
  process.exit(1);
});
