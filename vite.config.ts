import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import gameName from './gameName.js';
import path from 'path';

const htmlImport = {
  name: "htmlImport",
  /**
   * Checks to ensure that a html file is being imported.
   * If it is then it alters the code being passed as being a string being exported by default.
   * @param {string} code The file as a string.
   * @param {string} id The absolute path. 
   * @returns {{code: string}}
   */
  transform(code, id) {
    if (/^.*\.html$/g.test(id)) {
      code = `export default \`${code}\``;
    }
    return { code }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
        storyScript: path.resolve(__dirname, './src/Engine'),
        game: path.resolve(__dirname, `./src/Games/${gameName}/`)
    }
  },
  plugins: [tsconfigPaths(), htmlImport],
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 3000,
  },
  esbuild: {
    keepNames: true,
  },
  build: {
    target: 'esNext',
    outDir: "./dist"
  }
})