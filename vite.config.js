import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import mkcert from "vite-plugin-mkcert";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), 
    
    // mkcert()
  
  ],
  server: {
    https: false,
    host: "localhost",
    port: 5173,

    headers: {
    "Content-Security-Policy": "frame-src 'self' https://*.sumsub.com"
  }
  },
});
