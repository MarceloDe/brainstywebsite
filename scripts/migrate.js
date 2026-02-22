/**
 * migrate.js - One-time seed script to populate Firestore with existing repos.
 * 
 * Usage:
 * 1. Download service-account.json from Firebase Console (Settings > Service Accounts)
 * 2. Place it in the scripts/ folder
 * 3. Run: node scripts/migrate.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
// Replace with path to your service account key
const serviceAccount = require('./service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
    const seedPath = path.join(__dirname, 'repos-seed.json');
    if (!fs.existsSync(seedPath)) {
        console.error('Error: repos-seed.json not found. Run extraction first.');
        process.exit(1);
    }

    const repos = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    console.log(`Starting migration of ${repos.length} repositories...`);

    const batch = db.batch();
    const collection = db.collection('starred_repos');

    for (const repo of repos) {
        // Document ID: owner__repo (e.g. langchain-ai__langgraph)
        const docId = repo.full_name.replace('/', '__');
        const docRef = collection.doc(docId);

        const data = {
            full_name: repo.full_name,
            categories: repo.categories || [],
            tldr: repo.tldr || '',
            fitness: repo.fitness || 0,
            innovation_idea: repo.innovation_idea || '',
            html_url: repo.html_url,
            stars: repo.stars || 0,
            language: repo.language || null,
            added_at: admin.firestore.FieldValue.serverTimestamp(),
            last_synced: admin.firestore.FieldValue.serverTimestamp(),
            is_new: false
        };

        // Use set with merge: true to make it idempotent
        batch.set(docRef, data, { merge: true });
    }

    await batch.commit();
    console.log('✓ Migration complete!');
}

migrate().catch(console.error);
