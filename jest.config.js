import { createDefaultEsmPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
    testEnvironment: 'node',
    transform: {
        ...tsJestTransformCfg,
    },
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@types$': '<rootDir>/types/index.d.ts',
    },
};

export default jestConfig;
