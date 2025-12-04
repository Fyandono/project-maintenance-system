// vite.config.js (or vite.config.ts)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  // 👇 Add the server configuration here
  server: {
    // Allows access to the server from network interfaces (0.0.0.0 or true)
    host: true, 
    // Set the port (optional, as 5173 is the default)
    port: 5173, 
    // Automatically opens the browser when the server starts
    open: true, 
  },
})