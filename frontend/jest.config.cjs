
module.exports = {
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest", // Use Babel for transforming all JS/TS files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react).+', // Ensure `lucide-react` is transformed
  ],
  moduleNameMapper: {
    '\\.(css|css$|less|sass|scss)$': 'identity-obj-proxy', // Mock CSS imports
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testEnvironment: "jsdom", // Simulates a browser environment
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  collectCoverage: true,
};
