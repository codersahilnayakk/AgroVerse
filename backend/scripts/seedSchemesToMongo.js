const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('../models/schemeModel');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const schemes = [
  {
    title: 'PM Fasal Bima Yojana (PMFBY)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A crop insurance scheme that provides comprehensive risk coverage for pre-sowing to post-harvest losses due to natural calamities, pests, and diseases. The scheme has been allocated Rs. 16,000 crore to insure crops and protect farmers against financial losses.',
    category: 'Crop Insurance',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
    benefits: 'Low premium rates (2% for Kharif, 1.5% for Rabi crops), full sum insured coverage for crop losses, online claim settlement.',
    applicationProcess: 'Farmers can apply through local banks, insurance companies, or the PMFBY portal.',
    documents: 'Aadhaar Card, Land Records, Bank Account Details, Recent Passport Size Photograph',
    deadline: 'For Kharif: July 31, For Rabi: December 31',
    applicationLink: 'https://pmfby.gov.in/',
    imageUrl: 'https://vajiram-prod.s3.ap-south-1.amazonaws.com/Pradhan_Mantri_Krishi_Sinchayee_Yojana_PMKSY_7c6642090a.jpg',
    status: 'active'
  },
  {
    title: 'PM-Kisan Samman Nidhi',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Direct income support scheme providing Rs. 6,000 per year to eligible farmer families in three equal installments of Rs. 2,000 each, transferred directly to their bank accounts.',
    category: 'Income Support',
    eligibility: 'All landholding farmer families with cultivable land, subject to certain exclusions.',
    benefits: 'Direct financial assistance of Rs. 6,000 per year, transparent fund transfer, support for agricultural inputs.',
    applicationProcess: 'Registration through local revenue officers or online portal.',
    documents: 'Aadhaar Card, Land Records, Bank Account Details',
    deadline: 'Rolling enrollment throughout the year',
    applicationLink: 'https://pmkisan.gov.in/',
    imageUrl: 'https://bachatyojana.in/wp-content/uploads/2023/12/PM-Kisan-Samman-Nidhi-Yojana.png',
    status: 'active'
  },
  {
    title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    department: 'Ministry of Jal Shakti',
    description: 'A national mission to improve farm productivity and ensure better utilization of water resources. The scheme focuses on creating sources for assured irrigation and adopting precision irrigation technologies.',
    category: 'Irrigation',
    eligibility: 'All farmers looking to improve irrigation efficiency and water conservation.',
    benefits: 'Financial assistance for micro-irrigation systems, water conservation structures, and precision farming.',
    applicationProcess: 'Apply through District Agriculture Office or State Agriculture Department.',
    documents: 'Aadhaar Card, Land Records, Bank Account Details, Farm Layout Plan',
    deadline: 'Varies by state and component',
    applicationLink: 'https://pmksy.gov.in/',
    imageUrl: 'https://agricoop.nic.in/sites/default/files/pmksy_logo.png',
    status: 'active'
  },
  {
    title: 'Kisan Credit Card Scheme',
    department: 'Ministry of Finance',
    description: 'Provides farmers with affordable credit for their agricultural needs. The scheme offers access to short-term loans for cultivation, post-harvest expenses, and other farm requirements at concessional interest rates.',
    category: 'Loan Assistance',
    eligibility: 'All farmers, sharecroppers, tenant farmers, and self-help groups.',
    benefits: 'Flexible credit limits, low interest rates (4% with prompt repayment), coverage for crop production, equipment purchase, and farm development.',
    applicationProcess: 'Apply through local cooperative banks, regional rural banks, or commercial banks.',
    documents: 'Identity Proof, Address Proof, Land Records, Passport Size Photographs',
    deadline: 'Available year-round',
    applicationLink: 'https://www.nabard.org/content.aspx?id=592',
    imageUrl: 'https://thenewsmill.com/wp-content/uploads/2023/02/PM-Kisan-Credit-Card-Scheme.jpg',
    status: 'active'
  },
  {
    title: 'Agriculture Infrastructure Fund',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A financing facility providing Rs. 1 lakh crore for funding agriculture infrastructure projects at farm-gate and aggregation points.',
    category: 'Infrastructure',
    eligibility: 'Farmers, Primary Agricultural Credit Societies (PACS), FPOs, Self Help Groups, Agri-entrepreneurs, and Start-ups.',
    benefits: 'Loans with 3% interest subvention, credit guarantee coverage, and medium to long-term debt financing.',
    applicationProcess: 'Apply through the Agriculture Infrastructure Fund portal.',
    documents: 'Project Proposal, Registration Certificate, Land Documents, Bank Account Details',
    deadline: 'Available until 2029',
    applicationLink: 'https://agriinfra.dac.gov.in/',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHLLUKtOFOezvVDVPTPnPwEtasNp2QdgnQvg&s',
    status: 'active'
  },
  {
    title: 'National Mission for Sustainable Agriculture (NMSA)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A mission that promotes sustainable agriculture through climate change adaptation measures, resource conservation technologies, and integrated farming systems.',
    category: 'Sustainability',
    eligibility: 'All farmers interested in adopting sustainable agricultural practices.',
    benefits: 'Financial assistance for soil health management, rainwater harvesting, climate-resilient varieties, and organic farming.',
    applicationProcess: 'Apply through State Agriculture Department or District Agriculture Office.',
    documents: 'Aadhaar Card, Land Records, Bank Account Details, Farm Plan',
    deadline: 'Varies by component and state',
    applicationLink: 'https://nmsa.dac.gov.in/',
    imageUrl: 'https://onlineappsc.com/wp-content/uploads/2020/05/NATIONAL-MISSION-FOR-SUSTAINABLE-AGRICULTURE.jpg',
    status: 'active'
  }
];

const seedSchemes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');

    await Scheme.deleteMany();
    console.log('Existing schemes removed...');

    await Scheme.insertMany(schemes);
    console.log('New schemes seeded successfully!');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedSchemes();
