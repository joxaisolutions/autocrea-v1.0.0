import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '8001';
process.env.CLERK_SECRET_KEY = 'test_clerk_secret_key';
process.env.ANTHROPIC_API_KEY = 'test_anthropic_key';
process.env.CONVEX_URL = 'https://test.convex.cloud';

// Increase test timeout for integration tests
jest.setTimeout(10000);

// Global test setup
beforeAll(() => {
  console.log('🧪 Setting up test environment...');
});

// Global test teardown
afterAll(() => {
  console.log('✅ Test suite completed');
});
