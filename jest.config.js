import { createDefaultEsmPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
    testEnvironment: 'node',
    rootDir: 'src/',
    testMatch: ['<rootDir>/**/*.test.ts'],
    transform: {
        ...tsJestTransformCfg,
    },
    extensionsToTreatAsEsm: ['.ts'],
};

export default jestConfig;
