// module.exports = {
//   // Specifies the test environment
//   testEnvironment: 'jsdom',

//   // Handle module imports and file mocking
//   moduleNameMapper: {
//     // Handle CSS imports
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     // Handle module aliases
//     '^@/(.*)$': '<rootDir>/src/$1',
//     // Handle specific package imports
//     '^lucide-react$': 'lucide-react/dist/esm/index.js'
//   },

//   // Transform files with babel-jest
//   transform: {
//     '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }]
//   },

//   // Setup files to run before tests
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

//   // Coverage configuration
//   collectCoverageFrom: [
//     'src/**/*.{js,jsx,ts,tsx}',
//     '!src/**/*.d.ts',
//     '!src/main.tsx',
//     '!src/vite-env.d.ts'
//   ],

//   // File extensions to test
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
// };


// module.exports = {
//   // Specifies the test environment
//   testEnvironment: 'jsdom',

//   // Handle module imports and file mocking
//   moduleNameMapper: {
//     // Handle CSS imports
//     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     // Handle module aliases
//     '^@/(.*)$': '<rootDir>/src/$1',
//     // Handle lucide-react imports
//     '^lucide-react$': require.resolve('lucide-react')
//   },

//   // Transform files with babel-jest
//   transform: {
//     '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }]
//   },

//   // Setup files to run before tests
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

//   // Coverage configuration
//   collectCoverageFrom: [
//     'src/**/*.{js,jsx,ts,tsx}',
//     '!src/**/*.d.ts',
//     '!src/main.tsx',
//     '!src/vite-env.d.ts'
//   ],

//   // File extensions to test
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

//   // Test environment setup
//   testEnvironmentOptions: {
//     customExportConditions: ['node', 'node-addons'],
//   },

//   // Transform ignore patterns
//   transformIgnorePatterns: [
//     'node_modules/(?!(lucide-react)/)'
//   ]
// };

// jest.config.js or jest.config.ts

// module.exports = {
//   transform: {
//     "^.+\\.[t|j]sx?$": "babel-jest",  // Tells Jest to use babel-jest to transform JS/TS files
//   },
//   transformIgnorePatterns: [
//     '/node_modules/(?!lucide-react).+\\.js$', // Do not ignore lucide-react package
//   ],
//   moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
//   testEnvironment: "jsdom",  // Necessary if you're using React and testing components in a browser-like environment
//   transformIgnorePatterns: ['/node_modules/'], // Ignore node_modules
// };

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
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
