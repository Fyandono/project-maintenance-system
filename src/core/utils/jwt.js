import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
  if (!token) {
    console.error("Token is missing.");
    return null;
  }
  
  try {
    // Decode the token payload
    const decoded = jwtDecode(token);
  
    
    // Return the specific fields needed for the application state
    return decoded;
    
  } catch (error) {
    console.error("Failed to decode token. Token might be invalid or expired:", error);
    return null;
  }
};