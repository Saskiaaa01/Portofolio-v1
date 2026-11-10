import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // subfolder GitHub Pages: https://saskiaaa01.github.io/Portofolio-v1/
  base: '/Portofolio-v1/',
  plugins: [react(), tailwindcss()],
})
