import {defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'
import gameName from './gameName.js';

export default mergeConfig(viteConfig, defineConfig({
    test: {
        environment: 'jsdom',
        coverage: {
            enabled: true,
            provider: 'v8',
            reporter: ['json', 'html'],
            reportsDirectory: './src/Tests/coverage',
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