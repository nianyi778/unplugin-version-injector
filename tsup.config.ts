import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/core.ts', 'src/webpack.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  outDir: 'dist',
  external: ['webpack', 'webpack-sources', 'dayjs'],
});