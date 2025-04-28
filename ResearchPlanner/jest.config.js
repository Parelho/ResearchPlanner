module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Use 'node' if you don't need DOM testing
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
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