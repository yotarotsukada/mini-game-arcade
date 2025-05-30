import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'; // For resolving paths like '~/utils/game' if used in tests

export default defineConfig({
  plugins: [tsconfigPaths()], // Essential for resolving tsconfig paths if your source files use them
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom'
    include: ['./app/**/*.test.{ts,tsx}'],
    watchExclude: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
    // Optionally, if you need to mock CSS/assets for component tests later:
    // setupFiles: './vitest.setup.ts', // if you create this file
    // css: true, // if you want to process CSS, might need a CSS preprocessor if your components import CSS directly
  },
});
