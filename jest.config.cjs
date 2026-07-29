module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/src/__tests__/**/*.test.{js,jsx}'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/registerSW.js',
    '!src/components/IconSprite.jsx',
  ],
  coverageThreshold: {
    global: {
      lines: 75,
      branches: 75,
      functions: 75,
      statements: 75,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
};
