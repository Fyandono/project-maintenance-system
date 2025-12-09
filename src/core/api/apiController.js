import apiClient from './apiClient';

export const apiController = async ({
  method,
  endpoint,
  data = {},
  params = {},
  customConfig = {},
}) => {
  try {
    // 1. Configuration object (Note: getAuthHeader() is no longer needed here, 
    // as the Request Interceptor in apiClient.js handles the token.)
    const config = {
      params: params, 
      ...customConfig,
    };

    let response;

    // 2. Execute the request using the configured apiClient
    switch (method) {
      case 'get':
        // GET requests pass config directly (handles params and headers)
        response = await apiClient.get(endpoint, config);
        break;
      case 'post':
        // POST passes data, then config
        response = await apiClient.post(endpoint, data, config);
        break;
      case 'put':
        // PUT passes data, then config
        response = await apiClient.put(endpoint, data, config);
        break;
      case 'delete':
        // DELETE passes config
        response = await apiClient.delete(endpoint, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response;
  } catch (error) {
    // 3. Error Handlings:
    // If a 401 occurs, the interceptor (in apiClient.js) already logged out/redirected 
    // the user before throwing this error.
    
    // We simply re-throw the error so the calling Redux Thunk can catch it 
    // and use rejectWithValue to update the UI error state.
    throw error;
  }
};