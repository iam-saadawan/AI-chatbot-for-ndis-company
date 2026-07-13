import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [cssInjectedByJsPlugin()],
  build: {
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: 'pathways-widget.js',
        format: 'iife',
        name: 'PathwaysWidget'
      }
    }
  }
});
