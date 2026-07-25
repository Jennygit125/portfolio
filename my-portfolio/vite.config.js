import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import ViteSitemap from 'vite-plugin-sitemap'; // <-- Changed to default import
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  const rootDir = fileURLToPath(new URL('.', import.meta.url));
  const env = loadEnv(mode, rootDir, '');
  
  const baseUrl = env.VITE_SITE_URL || 'https://portfolio-three-kappa-33.vercel.app';

  return {
    plugins: [
      react(),
      tailwindcss(),
      ViteSitemap({
        baseUrl,
        routes: ['/'],
        generateRobotsTxt: true,
        robots: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/studio', '/studis'],
          },
        ],
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: 'The Thrill | Junior Full-Stack Web Developer',
            description: 'Portfolio and project showcase of Bakre Eniola Dahud (The Thrill), a junior full-stack web developer specializing in fast, secure web applications.',
          },
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },
  };
});