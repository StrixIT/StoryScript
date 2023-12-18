import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import gameName from './gameName.js';
import path from 'path';
import { normalizePath } from 'vite';
import { assetRegex } from './constants';

const gamePath = path.resolve(__dirname, `./src/Games/${gameName}/`);

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

const assetConstructorRegex = /return [a-zA-Z]{3,}\({/;

const addBuildDate = {
  name: "addBuildDate",
  /**
   * Add the build date to asset files.
   * @param {string} code The file as a string.
   * @param {string} id The absolute path. 
   * @returns {{code: string}}
   */
  transform(code, id) {
    if (assetRegex.test(id)) {
      var match = code.match(assetConstructorRegex);

      if (match) {
        code = code.replace(match[0], `${match}\r\n\tbuildTimeStamp: ${Date.now()},`);
      }

    }
    return { code }
  }
}

const resourceRegex = /\/resources\/(.{1,}\.)/;

var plugins = [
  addBuildDate,
  tsconfigPaths(),     
  viteStaticCopy({
    watch: {
      reloadPageOnChange: true
    },
    targets: [
      {
        src: normalizePath(path.resolve(gamePath, 'resources/**/*.*')),
        dest: 'resources',
        rename: (_, extension, fullPath) => {
          var match = fullPath.match(resourceRegex)[1];
          return match + extension;
        }
      }
    ]
  }),
  htmlImport
];

// Todo: add build date only in development
// if (process.env === 'development') {

// }

// https://vitejs.dev/config/
export default defineConfig({

  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
        storyScript: path.resolve(__dirname, './src/Engine'),
        game: gamePath
    }
  },
  plugins: plugins,
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