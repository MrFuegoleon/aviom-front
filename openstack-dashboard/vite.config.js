import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
  // Vous pouvez retirer la configuration esbuild si vous renommez vos fichiers en .jsx
  // esbuild: { loader: { '.js': 'jsx' } }
});
