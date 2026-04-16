module.exports = {
  preset: "react-native",
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx|js|jsx)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@seedchlogy/shared$": "<rootDir>/../packages/shared/src/index.ts",
    "^@seedchlogy/shared/(.*)$": "<rootDir>/../packages/shared/src/$1",
    "\\.(png|jpg|jpeg|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

