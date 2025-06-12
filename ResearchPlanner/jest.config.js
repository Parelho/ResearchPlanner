module.exports = {
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js"
  },
  testEnvironment: 'jsdom', // Use 'node' if you don't need DOM testing
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFiles: ['<rootDir>/jest.env.js'],
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // If you don't have a tsconfig.json, provide minimal TS config
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react', // or 'preserve' if not using React
        module: 'commonjs',
        esModuleInterop: true,
      },
    },
  },
};