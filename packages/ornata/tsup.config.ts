import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs', 'iife'],
    outDir: 'dist',
    dts: true,
    clean: true,
    globalName: 'Ornata',
    outExtension({ format }) {
        if (format === 'cjs') return { js: '.cjs' };
        if (format === 'iife') return { js: '.global.js' };
        return { js: '.js' };
    },
});
