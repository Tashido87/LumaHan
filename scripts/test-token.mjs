import fs from 'fs';
import path from 'path';

async function main() {
  const configPath = '/Users/tashido/.config/configstore/firebase-tools.json';
  if (!fs.existsSync(configPath)) {
    console.error('Config file not found');
    return;
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const accessToken = config.tokens?.access_token;
  if (!accessToken) {
    console.error('Access token not found in config');
    return;
  }

  const projectId = 'lumahan-10d75';
  console.log('Testing access token for project:', projectId);

  // Fetch users
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    console.error('Failed to fetch users:', response.status, await response.text());
    return;
  }

  const data = await response.json();
  console.log('Users found:', JSON.stringify(data, null, 2));
}

main().catch(console.error);
