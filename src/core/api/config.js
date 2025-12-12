const API_BASE_URL = import.meta.env.VITE_API_SERVER_BASE_URL || 'http://localhost:5555/';

const config = {
    // Use the variable exposed by Vite
    apiServerBaseUrl: API_BASE_URL, 
};

export default config;