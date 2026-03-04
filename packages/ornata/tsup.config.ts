import { defineConfig } from 'tsup';

export default [
    // ESM, CJS, and IIFE (production): no process ref, messages disabled
    defineConfig({
        entry: ['src/index.ts'],
        format: ['esm', 'cjs', 'iife'],
        outDir: 'dist',
        dts: true,
        clean: true,
        globalName: 'Ornata',
        define: {
            'process.env.NODE_ENV': JSON.stringify('production'),
        },
        outExtension({ format }) {
            if (format === 'cjs') return { js: '.cjs' };
            if (format === 'iife') return { js: '.global.js' };
            return { js: '.js' };
        },
    }),
    // IIFE (development): no process ref, full reporter messages
    defineConfig({
        entry: ['src/index.ts'],
        format: ['iife'],
        outDir: 'dist',
        clean: false,
        globalName: 'Ornata',
        define: {
            'process.env.NODE_ENV': JSON.stringify('development'),
        },
        outExtension() {
            return { js: '.global.dev.js' };
        },
    }),
];
