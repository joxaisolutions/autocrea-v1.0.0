import {
  generateCode,
  explainCode,
  fixCode,
  refactorCode,
  completeCode,
  chatWithAI,
} from '../../services/aiService';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: '```javascript\nfunction hello() {\n  console.log("Hello, World!");\n}\n```',
          },
        ],
        usage: {
          input_tokens: 100,
          output_tokens: 50,
        },
      }),
    },
  })),
});

describe('AI Service', () => {
  describe('generateCode', () => {
    it('should generate code with proper formatting', async () => {
      const result = await generateCode({
        prompt: 'Create a hello world function',
        language: 'javascript',
      });

      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('tokensUsed');
      expect(result.tokensUsed).toBe(150); // 100 input + 50 output
    });

    it('should include context when provided', async () => {
      const result = await generateCode({
        prompt: 'Add error handling',
        context: 'function fetchData() { return fetch("/api"); }',
        language: 'javascript',
      });

      expect(result).toBeDefined();
      expect(result.code).toBeDefined();
    });

    it('should handle framework-specific requests', async () => {
      const result = await generateCode({
        prompt: 'Create a React component',
        language: 'typescript',
        framework: 'React',
      });

      expect(result).toBeDefined();
      expect(result.code).toBeDefined();
    });
  });

  describe('explainCode', () => {
    it('should explain code clearly', async () => {
      const code = 'const arr = [1, 2, 3].map(x => x * 2);';
      const result = await explainCode(code, 'javascript');

      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('tokensUsed');
      expect(result.tokensUsed).toBeGreaterThan(0);
    });

    it('should work without language specified', async () => {
      const code = 'print("Hello")';
      const result = await explainCode(code);

      expect(result).toBeDefined();
    });
  });

  describe('fixCode', () => {
    it('should fix code errors', async () => {
      const buggyCode = 'function broken() { return x + y }';
      const error = 'ReferenceError: x is not defined';
      const result = await fixCode(buggyCode, error, 'javascript');

      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('code');
      expect(result.code).toBeDefined();
    });

    it('should provide explanation along with fix', async () => {
      const buggyCode = 'const arr = [1,2,3]; arr[10].toString();';
      const error = 'TypeError: Cannot read property toString of undefined';
      const result = await fixCode(buggyCode, error);

      expect(result.response).toBeTruthy();
    });
  });

  describe('refactorCode', () => {
    it('should refactor code according to instructions', async () => {
      const code = 'function add(a, b) { return a + b; }';
      const instructions = 'Convert to arrow function with TypeScript types';
      const result = await refactorCode(code, instructions, 'typescript');

      expect(result).toHaveProperty('code');
      expect(result.code).toBeDefined();
    });
  });

  describe('completeCode', () => {
    it('should provide code completion', async () => {
      const partialCode = 'function calculateTotal(items) {';
      const result = await completeCode(partialCode, undefined, 'javascript');

      expect(result).toHaveProperty('code');
      expect(result.code).toBeTruthy();
    });

    it('should consider cursor position when provided', async () => {
      const code = 'const user = { name: "John",  };';
      const result = await completeCode(code, 30);

      expect(result).toBeDefined();
    });
  });

  describe('chatWithAI', () => {
    it('should respond to chat messages', async () => {
      const result = await chatWithAI('What is React?');

      expect(result).toHaveProperty('response');
      expect(result.response).toBeTruthy();
    });

    it('should maintain conversation history', async () => {
      const history = [
        { role: 'user' as const, content: 'What is TypeScript?' },
        {
          role: 'assistant' as const,
          content: 'TypeScript is a typed superset of JavaScript.',
        },
      ];

      const result = await chatWithAI('Can you give me an example?', history);

      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      // Mock API error
      const Anthropic = require('@anthropic-ai/sdk');
      Anthropic.mockImplementationOnce(() => ({
        messages: {
          create: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      }));

      await expect(generateCode({ prompt: 'test' })).rejects.toThrow();
    });
  });

  describe('Token Usage Tracking', () => {
    it('should accurately track token usage', async () => {
      const result = await generateCode({
        prompt: 'Simple test',
      });

      expect(result.tokensUsed).toBe(150);
      expect(typeof result.tokensUsed).toBe('number');
    });
  });
});
