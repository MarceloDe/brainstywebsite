/**
 * check-count.js - Quick script to verify document count in Firestore
 */
const admin = require('firebase-admin');

// Use the service account we already have in the scripts folder
const serviceAccount = require('./scripts/service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkCount() {
    try {
        const snapshot = await db.collection('starred_repos').count().get();
        console.log(`Total documents in 'starred_repos': ${snapshot.data().count}`);

        // List first 5 to see structure
        const firstFive = await db.collection('starred_repos').limit(5).get();
        console.log('\nSample Repos:');
        firstFive.forEach(doc => {
            console.log(`- ${doc.id} (${doc.data().full_name})`);
        });
    } catch (e) {
        console.error('Error querying Firestore:', e.message);
    } finally {
        process.exit();
    }
}

checkCount();
