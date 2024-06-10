import type {Config} from 'jest';
import {defaults} from 'jest-config';

export default async (): Promise<Config> => {
  return {
    testEnvironment: 'node',
    preset: "jest-expo",
    testMatch: ["**/?(*.)+(spec|test).ts?(x)"],
    collectCoverageFrom: [
      "**/*.{ts,tsx}",
      "!**/coverage/**",
      "!**/node_modules/**",
      "!**/babel.config.js",
      "!**/jest.setup.js",
    ],
    moduleFileExtensions: ["js", "ts", "tsx"],
    transformIgnorePatterns: [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ],
    coverageReporters: ["json-summary", "text", "lcov"],
    moduleDirectories: [...defaults.moduleDirectories],
    setupFiles: ["<rootDir>/jestSetupFile.ts"],
      
    moduleNameMapper: {
      "@serv": "<rootDir>/src/services",
      "@firebaseServ": "<rootDir>/src/services/infra/firebase",
      "@context": "<rootDir>/src/context",
      "@components": "<rootDir>/src/components",
      "@screens": "<rootDir>/src/screens",
      "@domain": "<rootDir>/src/domain",
      "@assets": "<rootDir>/assets",
      //these files aren't particularly useful in tests so we can safely mock them out
      "@imgs": '<rootDir>/__mocks__/fileMock.js',
      "@dict": "<rootDir>/assets/dictionaries",
  },
}
};