import axios from 'axios';

const API_URL = '/api/queries';

// Submit a new farming query (public - no auth required)
const submitQuery = async (queryData) => {
  const response = await axios.post(API_URL, queryData);
  return response.data;
};

const queryService = {
  submitQuery,
};

export default queryService;
