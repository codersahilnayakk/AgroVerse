import axios from 'axios';

// Mock data for schemes
const schemes = [
  {
    _id: '1',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A crop insurance scheme that aims to provide financial support to farmers suffering crop loss/damage arising out of natural calamities.',
    eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.',
    benefits: 'Insurance coverage and financial support to farmers in the event of crop failure due to natural calamities, pests & diseases. Stabilizing the income of farmers to ensure their continuance in farming. Encouraging farmers to adopt innovative and modern agricultural practices.',
    applicationProcess: 'Farmers can apply online through the PMFBY portal or visit their nearest Common Service Centre (CSC), banks or insurance companies. For loanee farmers, the scheme is compulsory when they avail crop loans for notified crops.',
    documents: 'Identity proof, land records, bank account details, and details of crops grown. For non-loanee farmers, premium amount as per the crop and area.',
    contactInfo: 'Toll-Free Number: 1800-11-0124\nEmail: pmfby-agri@gov.in\nWebsite: www.pmfby.gov.in',
    status: 'Active',
    applicationUrl: 'https://pmfby.gov.in/',
    documentUrl: 'https://pmfby.gov.in/pdf/PMFBY_Guidelines.pdf',
    imageUrl: 'https://pmfby.gov.in/images/home_banner.jpg',
    relatedSchemes: [
      {
        _id: '2',
        name: 'PM-Kisan Samman Nidhi',
        description: 'Income support scheme that provides financial assistance to land-holding farmer families.',
        department: 'Ministry of Agriculture & Farmers Welfare'
      },
      {
        _id: '5',
        name: 'Agriculture Infrastructure Fund',
        description: 'Financing facility for investment in agriculture infrastructure projects.',
        department: 'Ministry of Agriculture & Farmers Welfare'
      }
    ]
  },
  {
    _id: '2',
    name: 'PM-Kisan Samman Nidhi',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A central sector scheme to provide income support to all landholding farmers\' families in the country to supplement their financial needs for procuring various inputs related to agriculture and allied activities as well as domestic needs.',
    eligibility: 'All land holding farmers\' families with cultivable land holding in their names are eligible. Institutional landholders and farmer families holding constitutional posts are not eligible.',
    benefits: 'Direct income support of Rs. 6,000 per year to eligible farmer families, payable in three equal installments of Rs. 2,000 each every four months. The amount is directly transferred into the bank accounts of the beneficiaries.',
    applicationProcess: 'Farmers can self-register through the PM-KISAN portal. They can also approach the local revenue officers, agriculture officers, or Common Service Centres for assistance in registration.',
    documents: 'Aadhaar card, land records, bank account details linked with Aadhaar.',
    contactInfo: 'Toll-Free Number: 1800-11-5526\nEmail: pmkisan-ict@gov.in\nWebsite: www.pmkisan.gov.in',
    status: 'Active',
    applicationUrl: 'https://pmkisan.gov.in/',
    documentUrl: 'https://pmkisan.gov.in/Documents/RevisedPM-KisanOperationalGuidelines(English).pdf',
    imageUrl: 'https://pmkisan.gov.in/images/homepage-banner.jpg',
    relatedSchemes: [
      {
        _id: '1',
        name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'A crop insurance scheme that aims to provide financial support to farmers suffering crop loss.',
        department: 'Ministry of Agriculture & Farmers Welfare'
      },
      {
        _id: '4',
        name: 'Kisan Credit Card',
        description: 'Credit service scheme for farmers to meet their agricultural needs.',
        department: 'Banking Institutions & NABARD'
      }
    ]
  },
  {
    _id: '3',
    name: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A national mission to improve farm productivity and ensure better utilization of water resources. The scheme focuses on creating sources for assured irrigation and adopting water conservation technologies.',
    eligibility: 'All farmers in areas covered under the scheme. Priority is given to small and marginal farmers.',
    benefits: 'Improved access to irrigation. Reduced dependency on rainfall. Enhanced water use efficiency. Precision irrigation facilities. Sustainable water conservation practices.',
    applicationProcess: 'Farmers need to apply through the agriculture/irrigation department of their respective states. The implementing agency varies by component.',
    documents: 'Land ownership documents, farmer identification, bank account details, and application forms specific to the component.',
    contactInfo: 'State Agriculture Department\nState Irrigation Department\nDistrict Agriculture Officer',
    status: 'Active',
    applicationUrl: 'https://pmksy.gov.in/',
    documentUrl: 'https://pmksy.gov.in/Guidelines.aspx',
    imageUrl: null,
    relatedSchemes: [
      {
        _id: '7',
        name: 'National Mission for Sustainable Agriculture (NMSA)',
        description: 'Promotes sustainable agriculture through climate change adaptation measures.',
        department: 'Ministry of Agriculture & Farmers Welfare'
      }
    ]
  },
  {
    _id: '4',
    name: 'Kisan Credit Card',
    department: 'Banking Institutions & NABARD',
    description: 'A credit service scheme for farmers to meet their agricultural needs and other requirements. It enables farmers to purchase agricultural inputs and draw cash for their production needs.',
    eligibility: 'All farmers, including small farmers, marginal farmers, share croppers, oral lessees, tenant farmers, and self-help groups (SHGs) of farmers.',
    benefits: 'Access to short-term loans for crops, working capital for allied activities, and investment credit for agriculture assets. Flexible repayment options based on harvesting/marketing season. Interest subvention and prompt repayment incentives. Coverage under personal accident insurance scheme.',
    applicationProcess: 'Farmers can apply through their nearest bank branches, cooperative banks, or regional rural banks. The application is processed and the card is issued after verification.',
    documents: 'Identity proof, address proof, land ownership documents (for land holders), tenancy agreement (for tenant farmers), passport-sized photographs.',
    contactInfo: 'Nearest bank branch\nNABARD Regional Office\nToll-Free Number: 1800-22-6888',
    status: 'Active',
    applicationUrl: null,
    documentUrl: 'https://www.nabard.org/auth/writereaddata/File/KCC%20Scheme.pdf',
    imageUrl: null,
    relatedSchemes: [
      {
        _id: '2',
        name: 'PM-Kisan Samman Nidhi',
        description: 'Income support scheme that provides financial assistance to land-holding farmer families.',
        department: 'Ministry of Agriculture & Farmers Welfare'
      }
    ]
  },
  {
    _id: '5',
    name: 'Agriculture Infrastructure Fund',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A financing facility launched as part of the Aatmanirbhar Bharat package to provide medium to long-term debt financing for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    eligibility: 'Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, Farmer Producers Organizations (FPOs), Self Help Groups (SHGs), farmers, Joint Liability Groups (JLGs), Multipurpose Cooperative Societies, agri-entrepreneurs, startups, and central/state agency or local body sponsored Public-Private Partnership Projects.',
    benefits: 'Interest subvention of 3% per annum, up to a loan amount of Rs. 2 crore. This will be available for a maximum period of 7 years. Credit guarantee through CGTMSE scheme for loans up to Rs. 2 crore. Interest subvention and credit guarantee cost to be borne by the government.',
    applicationProcess: 'Eligible beneficiaries can apply through a dedicated online portal or visit their nearest banking institution. Alternatively, they can also apply through concerned state agriculture departments.',
    documents: 'Organization registration documents, project proposal/detailed project report (DPR), land documents if applicable, quotations of machinery/equipment, bank statements, etc.',
    contactInfo: 'Toll-Free Number: 1800-11-4515\nEmail: aif-agri@gov.in\nWebsite: www.agriinfra.dac.gov.in',
    status: 'Active',
    applicationUrl: 'https://agriinfra.dac.gov.in/',
    documentUrl: 'https://agriinfra.dac.gov.in/Guidelines',
    imageUrl: null,
    relatedSchemes: [
      {
        _id: '6',
        name: 'Formation and Promotion of Farmer Producer Organizations (FPOs)',
        description: 'A scheme to form and promote FPOs through handholding and financial support.',
        department: 'Ministry of Agriculture & Farmers Welfare'
      }
    ]
  },
  {
    _id: '6',
    name: 'Formation and Promotion of Farmer Producer Organizations (FPOs)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A central sector scheme to form and promote 10,000 new Farmer Producer Organizations (FPOs) to facilitate small and marginal farmers to access technology, credit, and market through economies of scale.',
    eligibility: 'Small and marginal farmers who are willing to form a collective. A minimum of 300 farmers required in plain areas and 100 in North East & hilly areas to form an FPO.',
    benefits: 'Financial support up to Rs. 18 lakh per FPO for a period of 3 years. Credit guarantee facility through SFAC/NABARD. Equity grant up to Rs. 15 lakh. Training, capacity building, and handholding support.',
    applicationProcess: 'Interested farmers can approach their local Cluster-Based Business Organization (CBBO), Krishi Vigyan Kendra, or State agriculture department. The application is then forwarded to the implementing agency.',
    documents: 'Farmer identification, land records, bank account details, proposed business plan for the FPO.',
    contactInfo: 'Toll-Free Number: 1800-11-8424\nEmail: fpo-agri@gov.in\nWebsite: www.fpo.dac.gov.in',
    status: 'Active',
    applicationUrl: 'https://fpo.dac.gov.in/',
    documentUrl: 'https://fpo.dac.gov.in/Content/pdf/Guidlines.pdf',
    imageUrl: null,
    relatedSchemes: [
      {
        _id: '5',
        name: 'Agriculture Infrastructure Fund',
        description: 'Financing facility for investment in agriculture infrastructure projects.',
        department: 'Ministry of Agriculture & Farmers Welfare'
      }
    ]
  },
  {
    _id: '7',
    name: 'National Mission for Sustainable Agriculture (NMSA)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A mission to promote sustainable agriculture through integrated farming, appropriate soil health management, and resource conservation technologies.',
    eligibility: 'All farmers with focus on rainfed areas. Special emphasis on small and marginal farmers.',
    benefits: 'On-farm water management for improved water use efficiency. Soil Health Card for better nutrient management. Financial assistance for adopting climate-friendly technologies. Support for organic farming and agroforestry.',
    applicationProcess: 'Farmers can apply through their respective state agriculture departments or district agriculture offices.',
    documents: 'Land records, farmer identification, bank account details, and specific application forms for the component being applied for.',
    contactInfo: 'State Department of Agriculture\nDistrict Agriculture Officer\nToll-Free Number: 1800-11-1800',
    status: 'Active',
    applicationUrl: null,
    documentUrl: 'https://nmsa.dac.gov.in/Guidelines.aspx',
    imageUrl: null,
    relatedSchemes: [
      {
        _id: '3',
        name: 'Pradhan Mantri Krishi Sinchai Yojana (PMKSY)',
        description: 'A national mission to improve farm productivity and ensure better utilization of water resources.',
        department: 'Ministry of Agriculture & Farmers Welfare'
      }
    ]
  }
];

// Mock scheme service
const schemeService = {
  // Get all schemes
  getSchemes: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(schemes);
      }, 500);
    });
  },

  // Get a specific scheme by ID
  getSchemeById: async (id) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const scheme = schemes.find(scheme => scheme._id === id);
        if (scheme) {
          resolve(scheme);
        } else {
          reject(new Error('Scheme not found'));
        }
      }, 500);
    });
  },

  // Search schemes
  searchSchemes: async (query) => {
    query = query.toLowerCase();
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredSchemes = schemes.filter(
          (scheme) =>
            scheme.name.toLowerCase().includes(query) ||
            scheme.eligibility.toLowerCase().includes(query) ||
            scheme.benefits.toLowerCase().includes(query) ||
            (scheme.department && scheme.department.toLowerCase().includes(query))
        );
        resolve(filteredSchemes);
      }, 500);
    });
  }
};

export default schemeService; 