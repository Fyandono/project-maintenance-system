import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables for the current mode
  const env = loadEnv(mode, process.cwd(), '');
  
  // Define the default port
  const defaultPort = 5173;

  return {
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
    ],
    // 👇 Read the VITE_DEV_SERVER_PORT from the loaded environment variables
    server: {
      host: true, 
      port: env.VITE_DEV_SERVER_PORT ? parseInt(env.VITE_DEV_SERVER_PORT) : defaultPort, 
      open: true, 
    },
  };
});