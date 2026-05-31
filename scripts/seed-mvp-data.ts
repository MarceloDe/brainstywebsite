/**
 * Seeds the fixed Brainsty MVP dataset (Aetna PPO 1000 + University of Miami Health)
 * into Firestore at mvp_dataset/aetna_um.
 *
 * Requirements (the repo already expected a service account — see check-db.js):
 *   1. npm i -D firebase-admin tsx
 *   2. Place a Firebase service-account JSON at scripts/service-account.json
 *   3. npx tsx scripts/seed-mvp-data.ts
 *
 * The running app serves cards from src/ai/concierge/dataset.ts (the same data)
 * for speed; this seed mirrors that data into the database as the source of record
 * so it can be edited there later without a code deploy.
 */
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { MVP_DATASET } from '../src/ai/concierge/dataset';

const saPath = fileURLToPath(new URL('./service-account.json', import.meta.url));
const serviceAccount = JSON.parse(readFileSync(saPath, 'utf8'));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function main() {
  await db
    .collection('mvp_dataset')
    .doc('aetna_um')
    .set({ ...MVP_DATASET, updatedAt: new Date().toISOString() }, { merge: true });
  console.log('✅ Seeded mvp_dataset/aetna_um (Aetna PPO 1000 · University of Miami Health)');
  process.exit(0);
}

main().catch((e) => {
  console.error('Seed failed:', e?.message || e);
  process.exit(1);
});
