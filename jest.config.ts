/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // Sets the test environment for use with Jest/RTL
  testEnvironment: 'jsdom',
  // Test all .test.ts and .test.tsx files in /src
  testMatch: ['**/*.test.ts?(x)'],
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/'],
  // Allow scss imports in tests
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
