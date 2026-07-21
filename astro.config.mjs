// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://transporte.pages.dev', // se cambia cuando tengas dominio propio
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react()],
});