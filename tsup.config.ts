import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/vite.ts',
    'src/webpack.ts',
    'src/rspack.ts',
    'src/rollup.ts',
    'src/rolldown.ts',
  ],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  platform: 'node',
  splitting: false,
  shims: false,
  treeshake: true,
});
