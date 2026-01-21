import { builtinModules } from 'node:module';

import clear from 'rollup-plugin-clear';

import pkg from './package.json' with { type: 'json' };

import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

/** @type {import('rollup').RollupOptions} */
const config = {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: 'esm',
            sourcemap: true,
        },
    ],
    external: [
        ...builtinModules,
        ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
        ...(pkg.devDependencies ? Object.keys(pkg.devDependencies) : []),
        ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
    ],
    plugins: [
        clear({
            targets: ['build'],
        }),
        nodeResolve(),
        typescript({
            exclude: ['__tests__', '**/*.test.ts'],
        }),
    ],
};

export default config;
