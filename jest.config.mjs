export default {
    testEnvironment: "jsdom",
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/'],
    testMatch: [
        '**/__tests__/**/*.test.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|scss|sass)$': 'identity-obj-proxy',
    },
    clearMocks: true,
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    extensionsToTreatAsEsm: ['.jsx'],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
        '!src/**/index.{js,ts}',
    ],
    coverageDirectory: 'coverage',
    "coverageThreshold": {
        "global": {
            "branches": 80,
            "functions": 80,
            "lines": 80,
            "statements": 80
        }
    },
    verbose: true
};