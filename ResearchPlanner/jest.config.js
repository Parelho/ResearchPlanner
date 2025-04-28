module.exports = {
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js",
  },
  testEnvironment: 'jsdom', // Use 'node' if you don't need DOM testing
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
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