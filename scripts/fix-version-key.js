/* scripts/fix-version-key.js
   Converts __v fields stored as strings into numbers across collections.
   Usage:
     node scripts/fix-version-key.js           # fix all collections
     node scripts/fix-version-key.js users     # fix only 'users' collection
     DRY_RUN=1 node scripts/fix-version-key.js # show counts, no writes
*/
'use strict';

require('dotenv').config(); // load .env (for MONGO_URI / DATABASE_*)

const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db'); // uses your existing helper

async function fixCollection(collName, dryRun = false) {
  const db = mongoose.connection.db;
  const coll = db.collection(collName);

  // Count bad docs
  const stringCount = await coll.countDocuments({ __v: { $type: 'string' } });
  if (!stringCount) {
    console.log(`✔ ${collName}: no string __v found`);
    return { collName, fixed: 0, found: 0 };
  }

  console.log(`↻ ${collName}: found ${stringCount} doc(s) with string __v`);

  if (dryRun) return { collName, fixed: 0, found: stringCount };

  // Normalize empty strings first (if any)
  const emptyFix = await coll.updateMany({ __v: '' }, { $set: { __v: '0' } });
  if (emptyFix.modifiedCount) {
    console.log(`   • normalized empty string __v → "0" on ${emptyFix.modifiedCount} doc(s)`);
  }

  // Convert strings to integers (MongoDB 4.2+ pipeline update)
  const res = await coll.updateMany(
    { __v: { $type: 'string' } },
    [{ $set: { __v: { $toInt: '$__v' } } }]
  );

  console.log(`   • converted ${res.modifiedCount} doc(s) __v:string → __v:number`);
  return { collName, fixed: res.modifiedCount, found: stringCount };
}

(async () => {
  try {
    await connectDB(); // uses your config/db.js

    const db = mongoose.connection.db;
    const only = (process.argv[2] || '').trim(); // optional collection name
    const dryRun = !!process.env.DRY_RUN;

    let targets = [];
    if (only) {
      targets = [only];
    } else {
      // All collections in this database
      const cols = await db.listCollections().toArray();
      targets = cols.map(c => c.name);
    }

    console.log(`\n=== Fixing __v types ${dryRun ? '(DRY RUN)' : ''} ===`);
    console.log(`Target collections: ${targets.join(', ') || '(none found)' }\n`);

    const results = [];
    for (const name of targets) {
      // Skip system/internal collections
      if (name.startsWith('system.')) continue;
      // You can skip capped/queues if any:
      // if (name.includes('queue')) continue;

      try {
        const r = await fixCollection(name, dryRun);
        results.push(r);
      } catch (e) {
        console.error(`✖ ${name}: error`, e.message);
      }
    }

    // Summary
    const totalFound = results.reduce((s, r) => s + (r?.found || 0), 0);
    const totalFixed = results.reduce((s, r) => s + (r?.fixed || 0), 0);
    console.log(`\n=== Summary ===`);
    console.log(`Found ${totalFound} doc(s) with string __v across ${results.length} collection(s).`);
    console.log(
      dryRun
        ? `Dry run only—no changes written.`
        : `Fixed ${totalFixed} doc(s).`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed:', err);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
})();
