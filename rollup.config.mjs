import { builtinModules } from 'node:module';

import dts from 'rollup-plugin-dts';

import pkg from './package.json' with { type: 'json' };

import nodeResolve from '@rollup/plugin-node-resolve';

const config = [
    {
        input: `dist/types/parser.d.ts`,
        plugins: [dts()],
        output: {
            file: `dist/index.d.ts`,
            format: 'es',
        },
    },
    {
        input: 'dist/out/parser.js',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            },
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: true,
                exports: 'named',
            },
        ],
        external: [
            ...builtinModules,
            ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
            ...(pkg.devDependencies ? Object.keys(pkg.devDependencies) : []),
            ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
        ],
        plugins: [nodeResolve()],
    },
];

export default config;
