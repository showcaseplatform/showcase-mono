module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/test/prismaMock.ts'],
  testMatch: ['<rootDir>/**/*.test.ts'],
}
