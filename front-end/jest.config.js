/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {'\\.[jt]sx?$': 'esbuild-jest',},
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};