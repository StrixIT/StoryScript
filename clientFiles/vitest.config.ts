import {defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config'
import {currentGameName} from "./currentGameName.js";

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
                `src/Games/${currentGameName}/**`
            ],
            exclude: [
                '**/*.html',
                '**/*.d.ts',
                "**/*.json"
            ]
        }
    }
}));