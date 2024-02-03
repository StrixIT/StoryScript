import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
import gameName from './gameName.js';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['html'],
        reportsDirectory: './src/tests/coverage',
        reportOnFailure: true,
        include: [
          'src/Engine/**',
          `src/Games/${gameName}/**`
        ]
    }
  }
}));