import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'
import gameName from './gameName.js';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environmentMatchGlobs: [
      ['**/Data*.test.ts', 'jsdom'],
      ['**/ObjectConstructor.test.ts', 'jsdom'],
      ['**/LocalStorageService.test.ts', 'jsdom'],
    ],
    coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['json', 'html'],
        reportsDirectory: './src/tests/coverage',
        reportOnFailure: true,
        include: [
          'src/Engine/**',
          `src/Games/${gameName}/**`
        ],
        exclude: [
          '**/typeExtensions.d.ts',
          '**/defaultTexts.ts',
          '**/[iI]nterfaces/**',
        ]
    }
  }
}));