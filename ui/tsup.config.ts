import type { Options } from 'tsup';

export default <Options[]>[
  {
    entry: ['src/index.ts'],
    outDir: 'dist',
    outExtension: () => ({ js: '.js' }),
    format: ['iife'],
    clean: true,
    splitting: false,
    minify: true,
  },
];
