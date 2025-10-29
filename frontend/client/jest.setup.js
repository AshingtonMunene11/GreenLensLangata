import "@testing-library/jest-dom";
// Mock alert so tests don't crash
global.alert = jest.fn();
