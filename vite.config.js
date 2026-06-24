import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the built site works on GitHub Pages (served from a subpath).
  base: './',
  plugins: [react()],
})
