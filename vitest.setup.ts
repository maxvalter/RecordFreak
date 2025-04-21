import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './src/mocks/server';

beforeAll(() => {
  // Start the MSW server before all tests
  server.listen();
});

afterEach(() => {
  // Clean up after each test
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  // Close the MSW server after all tests
  server.close();
});
