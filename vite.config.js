import path from 'path';
import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';
import jsonfile from 'jsonfile';
import sortPackageJson from 'sort-package-json';

function editPackageJson() {
  return {
    name: 'edit-package-json',
    closeBundle() {
      jsonfile.readFile('src/package.json', (err, obj) => {
        if (!err) {
          obj.exports = {
            browser: {
              import: './browser/index.es.js',
              require: './browser/index.umd.js',
            },
            node: {
              import: './node/index.es.js',
              require: './node/index.cjs',
            },
          };
          jsonfile.writeFile('dist/package.json', sortPackageJson(obj), { spaces: 2 });
        }
      });
    },
  };
}

const buildBrowser = {
  outDir: 'dist/browser',
  lib: {
    entry: path.resolve(__dirname, 'src/browser.js'),
    name: 'LeaferUnified',
    formats: ['es', 'umd'],
    fileName: format => `index.${format}.js`,
  },
  rollupOptions: {
    external: ['leafer'],
    output: {
      globals: {
        leafer: 'Leafer',
      },
    },
    plugins: [
      copy({
        targets: [
          { src: 'LICENSE', dest: 'dist' },
          { src: 'README.md', dest: 'dist' },
        ],
        hook: 'writeBundle',
      }),
      editPackageJson(),
    ],
  },
};

const buildNode = {
  outDir: 'dist/node',
  lib: {
    entry: path.resolve(__dirname, 'src/node.js'),
    name: 'LeaferUnified',
    formats: ['es', 'cjs'],
    fileName: format => {
      if (format === 'cjs') {
        return 'index.cjs';
      }
      return `index.${format}.js`;
    },
  },
  rollupOptions: {
    external: ['@leafer/node'],
  },
};

const getMode = () => {
  if (process.argv.includes('browser')) {
    return 'browser';
  }
  if (process.argv.includes('node')) {
    return 'node';
  }
}

const getBuild = () => {
  const mode = getMode();
  if (mode === 'browser') {
    return buildBrowser;
  }
  if (mode === 'node') {
    return buildNode;
  }
};

export default defineConfig({
  resolve: {
    conditions: [getMode()],
  },
  build: getBuild(),
});
