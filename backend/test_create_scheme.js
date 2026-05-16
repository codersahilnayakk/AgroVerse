// Clean up test scheme created during debugging
require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('./models/schemeModel');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // Delete the "Test Scheme 123" created during debugging
    const result = await Scheme.deleteOne({ schemeName: 'Test Scheme 123' });
    console.log('Deleted test scheme:', result.deletedCount);
    
    // Show final state
    const schemes = await Scheme.find({}).sort({ createdAt: -1 });
    console.log(`\nFinal schemes in DB: ${schemes.length}`);
    schemes.forEach(s => {
      console.log(`- "${s.schemeName}" | category: ${s.category} | dept: ${s.department}`);
    });
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
