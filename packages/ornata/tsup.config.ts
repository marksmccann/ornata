import { defineConfig } from 'tsup';

export default [
    // ESM and CJS
    defineConfig({
        entry: ['src/index.ts'],
        format: ['esm', 'cjs'],
        outDir: 'dist',
        dts: true,
        clean: true,
        outExtension({ format }) {
            if (format === 'cjs') return { js: '.cjs' };
            return { js: '.js' };
        },
    }),
    // IIFE (development)
    defineConfig({
        entry: { 'index.global.dev': 'src/global.ts' },
        format: ['iife'],
        outDir: 'dist',
        clean: false,
        globalName: 'Ornata',
        define: {
            'process.env.NODE_ENV': JSON.stringify('development'),
        },
        outExtension() {
            return { js: '.js' };
        },
    }),
    // IIFE (production)
    defineConfig({
        entry: { 'index.global': 'src/global.ts' },
        format: ['iife'],
        outDir: 'dist',
        clean: false,
        minify: true,
        globalName: 'Ornata',
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        outExtension() {
            return { js: '.js' };
        },
    }),
];
