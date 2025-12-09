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
        const { response, config } = err;

        // If no response (network error), throw it
        if (!response) return Promise.reject(err);

        // Handle 401 Unauthorized
        if (response.status === 401) {

            // Check if request URL is NOT /login
            const isLoginEndpoint =
                config?.url?.includes("/login") ||
                config?.url?.endsWith("login");

            if (!isLoginEndpoint) {
                console.warn("401 received. Redirecting to login...");

                // Clear token
                TokenService.removeAccessToken();

                // Redirect to login
                window.location.href = "/login";
            }

            // Reject so calling function can handle the error
            return Promise.reject(err);
        }

        // Other HTTP errors
        return Promise.reject(err);
    }

    // Removed processQueue as it's no longer needed for direct login flow.
}

const request = new Request();
export default request.client;