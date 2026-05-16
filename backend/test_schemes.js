require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('./models/schemeModel');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    const schemes = await Scheme.find().sort({ createdAt: -1 }).limit(10);
    console.log(`Found ${schemes.length} schemes`);
    schemes.forEach(s => {
      console.log(`- ID: ${s._id}, Title: ${s.title}, SchemeName: ${s.schemeName}, category: ${s.category}, createdAt: ${s.createdAt}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
