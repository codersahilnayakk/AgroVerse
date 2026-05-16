/**
 * Migration script: Fix existing schemes that have title but no schemeName
 * (or vice-versa) due to being inserted with insertMany which skips mongoose hooks.
 * 
 * Run: node scripts/fixSchemeData.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('../models/schemeModel');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');

    // Find all schemes
    const schemes = await Scheme.find({});
    console.log(`Total schemes in DB: ${schemes.length}`);

    let fixedCount = 0;

    for (const scheme of schemes) {
      const updates = {};

      // Sync title <-> schemeName
      if (scheme.title && !scheme.schemeName) {
        updates.schemeName = scheme.title;
      }
      if (scheme.schemeName && !scheme.title) {
        updates.title = scheme.schemeName;
      }

      // Sync ministry <-> department
      if (scheme.ministry && !scheme.department) {
        updates.department = scheme.ministry;
      }
      if (scheme.department && !scheme.ministry) {
        updates.ministry = scheme.department;
      }

      // Sync officialLink <-> applicationLink
      if (scheme.officialLink && !scheme.applicationLink) {
        updates.applicationLink = scheme.officialLink;
      }
      if (scheme.applicationLink && !scheme.officialLink) {
        updates.officialLink = scheme.applicationLink;
      }

      // Sync bannerImage <-> imageUrl
      if (scheme.bannerImage && !scheme.imageUrl) {
        updates.imageUrl = scheme.bannerImage;
      }
      if (scheme.imageUrl && !scheme.bannerImage) {
        updates.bannerImage = scheme.imageUrl;
      }

      // Generate slug if missing
      if (!scheme.slug && (scheme.title || scheme.schemeName)) {
        const source = scheme.title || scheme.schemeName;
        updates.slug = source
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      if (Object.keys(updates).length > 0) {
        await Scheme.updateOne({ _id: scheme._id }, { $set: updates });
        fixedCount++;
        console.log(`  Fixed: ${scheme.title || scheme.schemeName} -> ${JSON.stringify(updates)}`);
      }
    }

    console.log(`\nDone! Fixed ${fixedCount} out of ${schemes.length} schemes.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
