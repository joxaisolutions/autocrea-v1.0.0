import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface AIGenerateRequest {
  prompt: string;
  context?: string;
  language?: string;
  framework?: string;
}

export interface AIResponse {
  response: string;
  code?: string;
  tokensUsed: number;
}

/**
 * Generate code using Claude AI
 */
export async function generateCode(
  request: AIGenerateRequest
): Promise<AIResponse> {
  const systemPrompt = `You are JoxCoder, an expert AI coding assistant specialized in web development.
You help developers create high-quality, production-ready code.
${request.framework ? `The project uses ${request.framework}.` : ''}
${request.language ? `Generate code in ${request.language}.` : ''}

Generate clean, well-structured code with:
- Best practices
- Proper error handling
- Clear comments
- Type safety (when applicable)
- Modern syntax`;

  const userPrompt = request.context
    ? `Context:\n${request.context}\n\nTask:\n${request.prompt}`
    : request.prompt;

  const message = await anthropic.messages.create({
    model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : '';

  // Extract code from markdown code blocks if present
  const codeMatch = responseText.match(/```[\w]*\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1].trim() : responseText;

  return {
    response: responseText,
    code: code,
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
  };
}

/**
 * Explain code using Claude AI
 */
export async function explainCode(
  code: string,
  language?: string
): Promise<AIResponse> {
  const systemPrompt = `You are JoxCoder, an expert AI coding assistant.
Explain code in a clear, educational manner that helps developers understand:
- What the code does
- How it works
- Best practices used
- Potential improvements`;

  const userPrompt = `${language ? `Language: ${language}\n\n` : ''}Please explain this code:\n\n\`\`\`\n${code}\n\`\`\``;

  const message = await anthropic.messages.create({
    model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : '';

  return {
    response: responseText,
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
  };
}

/**
 * Fix code errors using Claude AI
 */
export async function fixCode(
  code: string,
  errorMessage: string,
  language?: string
): Promise<AIResponse> {
  const systemPrompt = `You are JoxCoder, an expert AI coding assistant specialized in debugging and fixing code.
Analyze the error and provide a fixed version of the code with explanations.`;

  const userPrompt = `${language ? `Language: ${language}\n\n` : ''}Error:\n${errorMessage}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nPlease fix this code and explain the issue.`;

  const message = await anthropic.messages.create({
    model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    max_tokens: 3000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : '';

  // Extract fixed code from markdown code blocks
  const codeMatch = responseText.match(/```[\w]*\n([\s\S]*?)```/);
  const fixedCode = codeMatch ? codeMatch[1].trim() : '';

  return {
    response: responseText,
    code: fixedCode || code, // Return original if no fix extracted
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
  };
}

/**
 * Refactor code using Claude AI
 */
export async function refactorCode(
  code: string,
  instructions: string,
  language?: string
): Promise<AIResponse> {
  const systemPrompt = `You are JoxCoder, an expert AI coding assistant specialized in code refactoring.
Improve code quality, readability, and maintainability while preserving functionality.`;

  const userPrompt = `${language ? `Language: ${language}\n\n` : ''}Refactoring instructions:\n${instructions}\n\nCode to refactor:\n\`\`\`\n${code}\n\`\`\`\n\nProvide the refactored code with explanations of improvements.`;

  const message = await anthropic.messages.create({
    model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    max_tokens: 3000,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : '';

  // Extract refactored code from markdown code blocks
  const codeMatch = responseText.match(/```[\w]*\n([\s\S]*?)```/);
  const refactoredCode = codeMatch ? codeMatch[1].trim() : '';

  return {
    response: responseText,
    code: refactoredCode || code,
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
  };
}

/**
 * Auto-complete code using Claude AI
 */
export async function completeCode(
  code: string,
  cursorPosition?: number,
  language?: string
): Promise<AIResponse> {
  const systemPrompt = `You are JoxCoder, an expert AI coding assistant providing intelligent code completions.
Provide only the completion, not the entire code. Be concise and relevant.`;

  const userPrompt = `${language ? `Language: ${language}\n\n` : ''}Complete this code:\n\`\`\`\n${code}\n\`\`\`${cursorPosition ? `\n\nCursor is at position ${cursorPosition}` : ''}`;

  const message = await anthropic.messages.create({
    model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : '';

  // Try to extract code, but for completions it might just be the text
  const codeMatch = responseText.match(/```[\w]*\n([\s\S]*?)```/);
  const completion = codeMatch ? codeMatch[1].trim() : responseText.trim();

  return {
    response: completion,
    code: completion,
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
  };
}

/**
 * Chat with AI assistant
 */
export async function chatWithAI(
  message: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<AIResponse> {
  const systemPrompt = `You are JoxCoder, an expert AI coding assistant and mentor.
Help developers with coding questions, best practices, architecture decisions, and debugging.
Be friendly, educational, and provide practical advice.`;

  const messages = [
    ...(conversationHistory || []),
    { role: 'user' as const, content: message },
  ];

  const response = await anthropic.messages.create({
    model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
    max_tokens: 2000,
    system: systemPrompt,
    messages,
  });

  const responseText = response.content[0].type === 'text'
    ? response.content[0].text
    : '';

  return {
    response: responseText,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
  };
}
