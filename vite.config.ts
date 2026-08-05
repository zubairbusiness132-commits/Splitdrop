import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function copyToolHtmlPagesPlugin(): Plugin {
  return {
    name: 'copy-tool-html-pages',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        if (fs.existsSync(indexPath)) {
          const indexHtml = fs.readFileSync(indexPath, 'utf-8');
          const toolFiles = [
            'image-compressor.html',
            'image-converter.html',
            'pdf-merge.html',
            'pdf-split.html',
            'qr-generator.html',
            'resume-builder.html',
            'split-drop.html'
          ];
          toolFiles.forEach((file) => {
            const destPath = path.join(distDir, file);
            fs.writeFileSync(destPath, indexHtml, 'utf-8');
          });
        }
      } catch (err) {
        console.error('Failed to copy tool HTML pages:', err);
      }
    }
  };
}

export default defineConfig(() => {
  return {
    base: '/Splitdrop/',
    plugins: [react(), tailwindcss(), copyToolHtmlPagesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
