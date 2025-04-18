import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/vite.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    platform: 'node',
    splitting: false,
    shims: false,
    treeshake: true,
  },
  {
    entry: ['src/webpack.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    platform: 'node',
    splitting: false,
    shims: false,
    treeshake: true,
  },
  {
    entry: ['src/rollup.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    platform: 'node',
    splitting: false,
    shims: false,
    treeshake: true,
  }
]);