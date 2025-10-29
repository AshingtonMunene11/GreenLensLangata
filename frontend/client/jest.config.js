module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  }
};
