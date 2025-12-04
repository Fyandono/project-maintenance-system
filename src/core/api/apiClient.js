import axios from "axios";
import TokenService from "./tokenService";
import config from "./config";

class Request {
    
    // Note: clientSecret is not defined in the class body, added here for completeness
    // clientSecret = "your-client-secret-if-needed"; 

    constructor() {
        // Removed refresh logic properties
        this.client = axios.create({
            baseURL: config.apiServerBaseUrl, 
            // Note: clientSecret is only available if defined in config or as a class property
            // headers: {clientSecret: this.clientSecret} 
        });

        // Bind handler methods
        this.beforeRequest = this.beforeRequest.bind(this);
        this.onRequestFailure = this.onRequestFailure.bind(this);

        // Attach interceptors
        this.client.interceptors.request.use(this.beforeRequest);
        this.client.interceptors.response.use(Request.onRequestSuccess, this.onRequestFailure);
    }
    
    // --- Request Interceptor ---
    beforeRequest(request) {
        const token = TokenService.getAccessToken();
        console.log(token);
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    }
    
    // --- Response Success Interceptor ---
    static onRequestSuccess(response) {
        // Axios response interceptors should return the entire response object or the data.
        // Returning response.data is common, but be aware it hides the status code/headers.
        return response; 
    }
    
    // --- Response Failure Interceptor (The 401 Handler) ---
    async onRequestFailure(err) {
        const {response} = err;
        
        // ⭐️ CHECK for 401 status
        if (response && response.status === 401) {
            console.warn("401 Unauthorized error received. Clearing session.");

            // ⭐️ FIX: Remove the token and redirect to login
            TokenService.removeAccessToken();
            
            // Throw the response error so calling components/thunks can catch it
            // and update their local error states (e.g., showing a message).
            return Promise.reject(err);
        }
        
        // For all other errors (400, 404, 500, etc.), just throw the error up
        return Promise.reject(err);
    }
    
    // Removed processQueue as it's no longer needed for direct login flow.
}

const request = new Request();
export default request.client;