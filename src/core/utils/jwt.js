// src/core/utils/jwt.js
import { jwtDecode } from 'jwt-decode';

/**
 * Decodes a JWT and extracts key user information from its payload.
 * * @param {string} token The JWT string (access_token).
 * @returns {object | null} An object containing { username, name, role } or null if decoding fails.
 */
export const decodeToken = (token) => {
  if (!token) {
    console.error("Token is missing.");
    return null;
  }
  
  try {
    // Decode the token payload
    const decoded = jwtDecode(token);
    
    // Assuming your decoded token payload contains these specific keys
    // Adjust these key names (username, name, role) if your actual JWT uses different fields (e.g., 'sub', 'user_name', 'perms')
    const { username, name, role } = decoded; 
    
    // Return the specific fields needed for the application state
    return { username, name, role };
    
  } catch (error) {
    console.error("Failed to decode token. Token might be invalid or expired:", error);
    return null;
  }
};