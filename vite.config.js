import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'cli.js'),
      name: 'mdServer',
      formats: ['cjs'],
      fileName: () => 'md-server.js'
    },
    rollupOptions: {
      external: [
        'fs',
        'path',
        'url',
        'http',
        'https',
        'net',
        'os',
        'child_process',
        'process',
        'util',
        'events',
        'stream',
        'crypto',
        'zlib',
        'querystring',
        'buffer',
        'assert',
        'constants',
        'domain',
        'punycode',
        'string_decoder',
        'timers',
        'tty',
        'vm',
        'worker_threads'
      ],
      output: {
        exports: 'named'
      }
    },
    target: 'node18',
    minify: false,
    sourcemap: false
  }
}); 