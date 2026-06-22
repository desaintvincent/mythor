/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  projects: [
    {
      displayName: 'tiled',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/tiled/__tests__/**/*.spec.ts'],
      transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/packages/tiled/tsconfig.test.json' }],
      },
      setupFiles: ['<rootDir>/jest.setup.js'],
    },
    {
      displayName: 'other',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/packages/!(tiled)/**/__tests__/**/*.spec.ts',
        '<rootDir>/packages/!(tiled)/**/__tests__/**/*.test.ts',
      ],
      setupFiles: ['<rootDir>/jest.setup.js'],
    },
  ],
}
