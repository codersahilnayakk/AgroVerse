const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scheme = require('./models/schemeModel');

dotenv.config({ path: './.env' });

mongoose.connect('mongodb://localhost:27017/agroverse', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const schemesData = [
  {
    schemeName: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    department: 'Ministry of Agriculture and Farmers Welfare',
    description: 'A central sector scheme to provide income support to all landholding farmers families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities.',
    category: 'Income Support',
    eligibility: 'All landholding farmers families, which have cultivable landholding in their names. Higher economic status families are excluded.',
    benefits: 'Financial benefit of Rs. 6,000/- per year is released in three equal instalments of Rs. 2,000/- every four months directly into the bank accounts of beneficiaries.',
    applicationProcess: 'Eligible farmers can apply online through the official PM-KISAN portal or via Common Service Centres (CSCs). State nodal officers verify the applications.',
    applicationLink: 'https://pmkisan.gov.in/',
    documents: 'Aadhaar Card, Bank Account Details, Land Ownership Documents (Khasra/Khatauni).',
    deadline: 'Open throughout the year',
    imageUrl: '/img/schemes/pm_kisan.png'
  },
  {
    schemeName: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    department: 'Ministry of Agriculture and Farmers Welfare',
    description: 'A comprehensive crop insurance scheme designed to provide financial support to farmers suffering crop loss/damage arising out of unforeseen events, stabilizing the income of farmers.',
    category: 'Crop Insurance',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible. Loanee farmers are covered automatically.',
    benefits: 'Provides full insured amount for crop failures due to natural calamities, pests & diseases. Premium paid by farmers is extremely low (2% for Kharif, 1.5% for Rabi).',
    applicationProcess: 'Apply through banks, CSCs, or the National Crop Insurance Portal. Required within 15 days of sowing.',
    applicationLink: 'https://pmfby.gov.in/',
    documents: 'Aadhaar Card, Land records, Sowing certificate, Bank Passbook.',
    deadline: 'Varies by season (Usually July 15 for Kharif, Dec 15 for Rabi)',
    imageUrl: '/img/schemes/pmfby.png'
  },
  {
    schemeName: 'Soil Health Card Scheme',
    department: 'Department of Agriculture, Cooperation & Farmers Welfare',
    description: 'A scheme to promote soil test based nutrient management. It provides information to farmers on the nutrient status of their soil along with recommendations on appropriate dosage of nutrients to be applied.',
    category: 'Soil Health',
    eligibility: 'All farmers are eligible. State governments collect soil samples periodically from all agricultural landholdings.',
    benefits: 'Farmers receive a printed card indicating the status of their soil health and personalized recommendations for fertilizers, helping reduce input cost and improve yield.',
    applicationProcess: 'Contact local agriculture department officials or Krishi Vigyan Kendras (KVKs) for soil testing. Can also register via the national portal.',
    applicationLink: 'https://soilhealth.dac.gov.in/',
    documents: 'Aadhaar Card, Land details, Mobile Number.',
    deadline: 'Year-round',
    imageUrl: '/img/schemes/soil_health.png'
  },
  {
    schemeName: 'Kisan Credit Card (KCC)',
    department: 'Ministry of Finance & RBI',
    description: 'Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedures to the farmers for their cultivation and other needs.',
    category: 'Loan Assistance',
    eligibility: 'All farmers, individuals, joint borrowers who are owner cultivators, tenant farmers, oral lessees, and sharecroppers.',
    benefits: 'Credit limit based on operational land holding and cropping pattern. Subsidized interest rate of 7% p.a. Further 3% subvention for prompt repayment (effective rate 4%).',
    applicationProcess: 'Apply at any commercial bank, regional rural bank, or cooperative bank. Online application also available through the PM-KISAN portal.',
    applicationLink: 'https://pmkisan.gov.in/',
    documents: 'Aadhaar Card, PAN Card, Land ownership records, Passport size photograph.',
    deadline: 'Year-round',
    imageUrl: '/img/schemes/kisan_credit.png'
  },
  {
    schemeName: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    department: 'Ministry of Agriculture',
    description: 'Formulated with the vision of extending the coverage of irrigation and improving water use efficiency (More crop per drop) in a focused manner.',
    category: 'Irrigation',
    eligibility: 'All farmers, farming groups, and agricultural cooperative societies holding cultivable land.',
    benefits: 'Financial assistance/subsidy for installing micro-irrigation systems (Drip and Sprinkler). Subsidy ranges from 55% to 100% depending on state and farmer category.',
    applicationProcess: 'Apply through the state horticulture or agriculture department portals. Involves field inspection before installation.',
    applicationLink: 'https://pmksy.gov.in/',
    documents: 'Aadhaar Card, Land records, Bank Details, Quotation from registered vendor.',
    deadline: 'Year-round',
    imageUrl: '/img/schemes/pmksy.png'
  },
  {
    schemeName: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    department: 'Ministry of Agriculture',
    description: 'Promotes organic farming through the adoption of organic villages by cluster approach and PGS (Participatory Guarantee System) certification.',
    category: 'Organic Farming',
    eligibility: 'Farmers willing to form a cluster of at least 20 hectares. All farmers in the cluster must agree to practice organic farming.',
    benefits: 'Financial assistance of Rs. 50,000 per hectare for 3 years is provided for organic inputs, certification, labeling, packaging, and transportation.',
    applicationProcess: 'Farmers form groups/clusters and apply through state agriculture departments or local KVKs.',
    applicationLink: 'https://pgsindia-ncof.gov.in/',
    documents: 'Aadhaar Card, Land details, Group formation resolution.',
    deadline: 'Subject to state notification',
    imageUrl: '/img/schemes/pkvy.png'
  },
  {
    schemeName: 'National Livestock Mission (NLM)',
    department: 'Department of Animal Husbandry & Dairying',
    description: 'Aims to ensure quantitative and qualitative improvement in livestock production systems and capacity building of all stakeholders.',
    category: 'Livestock',
    eligibility: 'Individual farmers, FPOs, SHGs, JLGs, and Section 8 companies involved in livestock farming.',
    benefits: 'Provides 50% capital subsidy (up to Rs. 50 lakhs) for establishing rural poultry, sheep/goat/pig breeding farms, and fodder production units.',
    applicationProcess: 'Applications are submitted online via the NLM portal, followed by bank appraisal and state government recommendation.',
    applicationLink: 'https://nlm.udyamimitra.in/',
    documents: 'Project Report, Land records, Bank loan sanction letter, KYC documents.',
    deadline: 'Year-round',
    imageUrl: '/img/schemes/livestock.png'
  },
  {
    schemeName: 'Agriculture Infrastructure Fund (AIF)',
    department: 'Ministry of Agriculture',
    description: 'A medium-long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    category: 'Equipment Subsidy',
    eligibility: 'Primary Agricultural Credit Societies (PACS), FPOs, Agriculture entrepreneurs, Startups, and individual farmers.',
    benefits: '3% interest subvention per annum up to a limit of Rs. 2 crore. Credit guarantee coverage for eligible borrowers.',
    applicationProcess: 'Submit project proposal and loan application to participating banks or via the AIF portal.',
    applicationLink: 'https://agriinfra.dac.gov.in/',
    documents: 'DPR (Detailed Project Report), KYC, Land documents, Bank mandate.',
    deadline: 'Valid up to 2032-33',
    imageUrl: '/img/schemes/agri_infra.png'
  }
];

const seedData = async () => {
  try {
    await Scheme.deleteMany(); // Clear garbage test data
    await Scheme.insertMany(schemesData);
    console.log('Real Agriculture Schemes Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
