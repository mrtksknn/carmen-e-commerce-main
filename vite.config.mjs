import { createHash } from 'node:crypto';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { DEFAULT_SITE_URL, normalizeSiteUrl } from './src/lib/seo-data.mjs';

/**
 * Production-only security headers as <meta> tags (GitHub Pages cannot set
 * response headers). The Content-Security-Policy only allows the services the
 * site actually talks to, so injected markup cannot load or send anything
 * elsewhere. Inline scripts in index.html are allowed by their hash.
 */
const securityMeta = () => ({
  name: 'security-meta',
  apply: 'build',
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
        .map(([, body]) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`);

      const csp = [
        "default-src 'self'",
        // apis.google.com: Firebase Auth loads its helper from there
        `script-src 'self' https://apis.google.com ${hashes.join(' ')}`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https://wsrv.nl https://images.weserv.nl https://i.ibb.co https://api.qrserver.com",
        "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseinstallations.googleapis.com https://api.emailjs.com https://api.imgbb.com",
        "frame-src https://*.firebaseapp.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ].join('; ');

      const tags = [
        `<meta http-equiv="Content-Security-Policy" content="${csp}" />`,
        '<meta name="referrer" content="strict-origin-when-cross-origin" />',
      ].join('\n    ');
      return html.replace(/<meta charset="utf-8" \/>/i, (m) => `${m}\n    ${tags}`);
    },
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // The public address decides the base path: "/carmen-e-commerce-main/" on
  // GitHub Pages today, "/" once VITE_SITE_URL is the site's own domain.
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL || DEFAULT_SITE_URL);
  const base = `${new URL(siteUrl).pathname.replace(/\/+$/, '')}/`;

  return {
  plugins: [react(), securityMeta()],
  base,
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  define: {
    'process.env': {},
  },
  };
});
