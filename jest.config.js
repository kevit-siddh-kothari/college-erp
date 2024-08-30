module.exports = {
    preset: 'ts-jest',                    // Use ts-jest preset to handle TypeScript files
    testEnvironment: 'node',              // Set the test environment to Node.js
    testMatch: ['**/src/testing/**/*.test.(ts|js)'], // Match test files in src/testing
    moduleFileExtensions: ['ts', 'js'],   // Support both TypeScript and JavaScript files
    rootDir: '.',                         // Define the root directory of the project
    transform: {
      '^.+\\.ts?$': 'ts-jest',            // Transform TypeScript files using ts-jest
    },
  };
  