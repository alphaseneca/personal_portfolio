import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';

function getSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.SITE) return process.env.SITE;
  if (fs.existsSync('CNAME')) {
    const cname = fs.readFileSync('CNAME', 'utf-8').trim();
    if (cname) return `https://${cname}`;
  }
  return undefined;
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: getSiteUrl(),
  vite: {
    plugins: [tailwindcss()],
  },
});
