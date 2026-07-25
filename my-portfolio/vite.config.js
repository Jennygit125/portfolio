import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import { ViteSitemap } from 'vite-plugin-sitemap';
import { createHtmlPlugin } from 'vite-plugin-html';
import process from 'node:process';

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  
  // Fallback 
  const baseUrl = env.VITE_SITE_URL || 'https://portfolio-two-ecru-78.vercel.app';

  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      ViteSitemap({
        baseUrl,
        // Only include public routes in the sitemap (exclude /studio)
        routes: ['/'],
        generateRobotsTxt: true,
        robots: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/studio', '/studis'], // Keep private studio pages hidden from bots
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