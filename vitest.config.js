import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// The kit ships raw JSX (no build step); tests run against src directly.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,jsx}'],
  },
});
