const API_BASE_URL = 'http://localhost:5005';

export const API_ROUTES = {
    CANDIDATES: {
        SAVE: `${API_BASE_URL}/api/candidates/save`,
        GET: `${API_BASE_URL}/api/candidates/get`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/candidates/get-by-id/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/api/candidates/update-by-id/${id}`,
        DELETE: (id) => `${API_BASE_URL}/api/candidates/delete-by-id/${id}`,
    },
    CUSTOMERS: {
        SAVE: `${API_BASE_URL}/api/customer/save`,
        GET: `${API_BASE_URL}/api/customer/get`,
        GET_BY_ID: (id) => `${API_BASE_URL}/api/customer/get-by-id/${id}`,
    },
    // Add other routes as needed
};

export default API_BASE_URL;
