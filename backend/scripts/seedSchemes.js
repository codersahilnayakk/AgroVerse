const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('../models/schemeModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding schemes'))
.catch(err => console.error('MongoDB connection error:', err));

// Mock schemes data
const schemes = [
  {
    schemeName: 'PM Fasal Bima Yojana (PMFBY)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A crop insurance scheme that provides comprehensive risk coverage for pre-sowing to post-harvest losses due to natural calamities, pests, and diseases. The scheme has been allocated Rs. 16,000 crore to insure crops and protect farmers against financial losses.',
    category: 'insurance',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.',
    benefits: 'Low premium rates (2% for Kharif, 1.5% for Rabi crops), full sum insured coverage for crop losses, online claim settlement.',
    applicationLink: 'https://pmfby.gov.in/',
    applicationProcess: 'Farmers can apply through local banks, insurance companies, or the PMFBY portal.',
    documents: 'Aadhaar Card, Land Records, Bank Account Details, Recent Passport Size Photograph',
    deadline: '2023-12-31',
    imageUrl: 'https://vajiram-prod.s3.ap-south-1.amazonaws.com/Pradhan_Mantri_Krishi_Sinchayee_Yojana_PMKSY_7c6642090a.jpg'
  },
  {
    schemeName: 'PM-Kisan Samman Nidhi',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Direct income support scheme providing Rs. 6,000 per year to eligible farmer families in three equal installments of Rs. 2,000 each, transferred directly to their bank accounts.',
    category: 'income',
    eligibility: 'All landholding farmer families with cultivable land, subject to certain exclusions.',
    benefits: 'Direct financial assistance of Rs. 6,000 per year, transparent fund transfer, support for agricultural inputs.',
    applicationLink: 'https://pmkisan.gov.in/',
    applicationProcess: 'Registration through local revenue officers or online portal.',
    documents: 'Aadhaar Card, Land Records, Bank Account Details',
    deadline: '2023-12-31',
    imageUrl: 'https://bachatyojana.in/wp-content/uploads/2023/12/PM-Kisan-Samman-Nidhi-Yojana.png'
  },
  {
    schemeName: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    department: 'Ministry of Jal Shakti',
    description: 'A national mission to improve farm productivity and ensure better utilization of water resources. The scheme focuses on creating sources for assured irrigation and adopting precision irrigation technologies.',
    category: 'irrigation',
    eligibility: 'All farmers looking to improve irrigation efficiency and water conservation.',
    benefits: 'Financial assistance for micro-irrigation systems, water conservation structures, and precision farming.',
    applicationLink: 'https://pmksy.gov.in/',
    applicationProcess: 'Apply through District Agriculture Office or State Agriculture Department.',
    documents: 'Aadhaar Card, Land Records, Bank Account Details, Farm Layout Plan',
    deadline: '2023-12-31',
    imageUrl: 'https://pwonlyias.com/wp-content/uploads/2023/10/pradhan-mantri-krishi-sinchayee-yojana-pmksy-653b991886d09.webp'
  },
  {
    schemeName: 'Kisan Credit Card Scheme',
    department: 'Ministry of Finance',
    description: 'Provides farmers with affordable credit for their agricultural needs. The scheme offers access to short-term loans for cultivation, post-harvest expenses, and other farm requirements at concessional interest rates.',
    category: 'credit',
    eligibility: 'All farmers, sharecroppers, tenant farmers, and self-help groups.',
    benefits: 'Flexible credit limits, low interest rates (4% with prompt repayment), coverage for crop production, equipment purchase, and farm development.',
    applicationLink: 'https://www.nabard.org/content.aspx?id=592',
    applicationProcess: 'Apply through local cooperative banks, regional rural banks, or commercial banks.',
    documents: 'Identity Proof, Address Proof, Land Records, Passport Size Photographs',
    deadline: '2023-12-31',
    imageUrl: 'https://thenewsmill.com/wp-content/uploads/2023/02/PM-Kisan-Credit-Card-Scheme.jpg'
  },
  {
    schemeName: 'Agriculture Infrastructure Fund',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A financing facility providing Rs. 1 lakh crore for funding agriculture infrastructure projects at farm-gate and aggregation points. The scheme supports development of post-harvest management infrastructure and community farming assets.',
    category: 'infrastructure',
    eligibility: 'Farmers, Primary Agricultural Credit Societies (PACS), FPOs, Self Help Groups, Agri-entrepreneurs, and Start-ups.',
    benefits: 'Loans with 3% interest subvention, credit guarantee coverage, and medium to long-term debt financing.',
    applicationLink: 'https://agriinfra.dac.gov.in/',
    applicationProcess: 'Apply through the Agriculture Infrastructure Fund portal.',
    documents: 'Project Proposal, Registration Certificate, Land Documents, Bank Account Details',
    deadline: '2029-12-31',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHLLUKtOFOezvVDVPTPnPwEtasNp2QdgnQvg&s'
  },
  {
    schemeName: 'Formation and Promotion of Farmer Producer Organizations',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Initiative to form and promote 10,000 new Farmer Producer Organizations (FPOs) to enhance production, productivity, and profitability of farmers through economies of scale, collective bargaining, and market linkages.',
    category: 'cooperative',
    eligibility: 'Groups of farmers, particularly small and marginal farmers.',
    benefits: 'Financial support up to Rs. 18 lakh per FPO, professional handholding, business planning, and market linkage support.',
    applicationLink: 'https://agricoop.nic.in/en/divisiontype/fpos',
    applicationProcess: 'Apply through nearest Implementing Agency or NABARD/SFAC offices.',
    documents: 'Group Members List, Proposed Bylaws, Business Plan',
    deadline: '2024-03-31',
    imageUrl: 'https://pwonlyias.com/wp-content/uploads/2023/10/farmer-653a637716c8b-1568x882.webp'
  },
  {
    schemeName: 'National Mission for Sustainable Agriculture (NMSA)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A mission that promotes sustainable agriculture through climate change adaptation measures, resource conservation technologies, and integrated farming systems. It focuses on soil health management, water conservation, and climate-smart agricultural practices.',
    category: 'sustainability',
    eligibility: 'All farmers interested in adopting sustainable agricultural practices.',
    benefits: 'Financial assistance for soil health management, rainwater harvesting, climate-resilient varieties, and organic farming.',
    applicationLink: 'https://nmsa.dac.gov.in/',
    applicationProcess: 'Apply through State Agriculture Department or District Agriculture Office.',
    documents: 'Aadhaar Card, Land Records, Bank Account Details, Farm Plan',
    deadline: '2023-12-31',
    imageUrl: 'https://onlineappsc.com/wp-content/uploads/2020/05/NATIONAL-MISSION-FOR-SUSTAINABLE-AGRICULTURE.jpg'
  }
];

// Insert schemes into the database
const seedSchemes = async () => {
  try {
    // First, clear existing data
    await Scheme.deleteMany({});
    console.log('Existing schemes deleted');

    // Insert the new schemes
    await Scheme.insertMany(schemes);
    console.log('Schemes successfully seeded to database');
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding schemes:', error);
    process.exit(1);
  }
};

seedSchemes(); 