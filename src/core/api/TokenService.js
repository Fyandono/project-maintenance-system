// src/services/TokenService.js

class TokenService {
    
    // Key used to store the token in localStorage
    static ACCESS_TOKEN_KEY = "accessToken";

    // Static method to get the access token
    static getAccessToken() {
        return localStorage.getItem(TokenService.ACCESS_TOKEN_KEY);
    }

    // Static method to set the access token
    static setAccessToken(token) {
        localStorage.setItem(TokenService.ACCESS_TOKEN_KEY, token);
    }

    // Static method to remove the access token (LOGOUT)
    static removeAccessToken() {
        localStorage.removeItem(TokenService.ACCESS_TOKEN_KEY);
        // ⭐️ Optional: Force redirect to login page immediately after removal
        // This relies on your routing setup. If using React Router, you'd navigate.
        // For a hard browser redirect:
        window.location.href = '/login'; 
    }
}

export default TokenService;