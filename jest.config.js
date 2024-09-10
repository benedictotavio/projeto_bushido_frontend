module.exports = {  
    preset: 'jest-preset-angular',  
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'], 
    coverageReporters: ['html'],
    collectCoverageFrom: [  
      'src/app/**/*.{js,jsx,ts,tsx}',  
      '!src/app/**/*.spec.{js,jsx,ts,tsx}',  
    ],
    testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],  
    moduleNameMapper: {  
      '^src/(.*)$': '<rootDir>/src/$1',  
      '\\.(css|less|scss)$': 'identity-obj-proxy',  
    },  
  };