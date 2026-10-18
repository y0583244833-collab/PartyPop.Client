import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// פורט 5173 כי זו הכתובת שמותרת ב-CORS של השרת (appsettings.Development.json)
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
