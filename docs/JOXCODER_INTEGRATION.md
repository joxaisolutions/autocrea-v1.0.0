# JoxCoder AI Integration Guide

Guía completa para integrar el modelo JoxCoder v1.0.0 en AUTOCREA.

---

## Descripción

**JoxCoder** es el modelo de IA propietario de JoxAI especializado en generación de código. Está entrenado específicamente para:

- Generar código limpio y funcional
- Refactorizar y optimizar código existente
- Detectar errores y vulnerabilidades
- Explicar código de forma clara
- Sugerir mejoras y best practices

---

## Prerrequisitos

1. Modelo JoxCoder v1.0.0 desplegado y accesible vía API
2. API Key válida
3. Backend de AUTOCREA configurado y funcionando

---

## Arquitectura de Integración

```
┌─────────────────┐
│   Frontend      │
│   (Next.js)     │
└────────┬────────┘
         │
         │ HTTP Request
         │
         ▼
┌─────────────────┐
│   Backend       │
│   (Express)     │
│                 │
│  ┌───────────┐  │
│  │ AI Router │  │
│  └─────┬─────┘  │
│        │        │
│        ▼        │
│  ┌───────────┐  │
│  │ JoxCoder  │  │
│  │  Service  │  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         │ API Call
         │
         ▼
┌─────────────────┐
│   JoxCoder AI   │
│   Model API     │
│   (JoxAI Cloud) │
└─────────────────┘
```

---

## Configuración

### 1. Variables de Entorno

Añadir en `backend/.env`:

```env
# JoxCoder AI Configuration
JOXCODER_API_URL=https://api.joxai.org/v1/joxcoder
JOXCODER_API_KEY=jxc_your_api_key_here
JOXCODER_MODEL_VERSION=v1.0.0
JOXCODER_MAX_TOKENS=2048
JOXCODER_TEMPERATURE=0.7
JOXCODER_TIMEOUT=30000

# Feature Flag
ENABLE_AI_GENERATION=true
```

### 2. API Client Service

Crear `backend/src/services/ai-integration/joxcoder.service.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';
import { logger } from '@/utils/logger';

interface JoxCoderRequest {
  prompt: string;
  context?: {
    language?: string;
    framework?: string;
    files?: string[];
  };
  maxTokens?: number;
  temperature?: number;
}

interface JoxCoderResponse {
  code: string;
  explanation?: string;
  suggestions?: string[];
  confidence: number;
}

export class JoxCoderService {
  private client: AxiosInstance;
  private apiUrl: string;
  private apiKey: string;
  private modelVersion: string;

  constructor() {
    this.apiUrl = process.env.JOXCODER_API_URL || '';
    this.apiKey = process.env.JOXCODER_API_KEY || '';
    this.modelVersion = process.env.JOXCODER_MODEL_VERSION || 'v1.0.0';

    if (!this.apiUrl || !this.apiKey) {
      throw new Error('JoxCoder API credentials not configured');
    }

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: parseInt(process.env.JOXCODER_TIMEOUT || '30000'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Model-Version': this.modelVersion,
      },
    });

    // Response interceptor para logging
    this.client.interceptors.response.use(
      (response) => {
        logger.info('JoxCoder API response received', {
          status: response.status,
          tokens: response.data.usage?.totalTokens,
        });
        return response;
      },
      (error) => {
        logger.error('JoxCoder API error', {
          status: error.response?.status,
          message: error.message,
        });
        throw error;
      }
    );
  }

  /**
   * Generar código a partir de un prompt
   */
  async generateCode(request: JoxCoderRequest): Promise<JoxCoderResponse> {
    try {
      const response = await this.client.post('/generate', {
        prompt: request.prompt,
        context: request.context,
        maxTokens: request.maxTokens || parseInt(process.env.JOXCODER_MAX_TOKENS || '2048'),
        temperature: request.temperature || parseFloat(process.env.JOXCODER_TEMPERATURE || '0.7'),
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to generate code', { error });
      throw new Error('Code generation failed');
    }
  }

  /**
   * Refactorizar código existente
   */
  async refactorCode(code: string, instructions: string): Promise<JoxCoderResponse> {
    try {
      const response = await this.client.post('/refactor', {
        code,
        instructions,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to refactor code', { error });
      throw new Error('Code refactoring failed');
    }
  }

  /**
   * Explicar código
   */
  async explainCode(code: string): Promise<{ explanation: string }> {
    try {
      const response = await this.client.post('/explain', {
        code,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to explain code', { error });
      throw new Error('Code explanation failed');
    }
  }

  /**
   * Analizar código para detectar errores
   */
  async analyzeCode(code: string, language: string): Promise<{
    errors: Array<{ line: number; message: string; severity: string }>;
    suggestions: string[];
  }> {
    try {
      const response = await this.client.post('/analyze', {
        code,
        language,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to analyze code', { error });
      throw new Error('Code analysis failed');
    }
  }

  /**
   * Completar código (autocompletado)
   */
  async completeCode(
    code: string,
    cursorPosition: { line: number; column: number },
    language: string
  ): Promise<{ completions: Array<{ text: string; description: string }> }> {
    try {
      const response = await this.client.post('/complete', {
        code,
        cursorPosition,
        language,
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to complete code', { error });
      throw new Error('Code completion failed');
    }
  }

  /**
   * Verificar health del servicio
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      logger.error('JoxCoder health check failed', { error });
      return false;
    }
  }
}

// Singleton instance
export const joxCoderService = new JoxCoderService();
```

### 3. API Routes

Crear `backend/src/api/routes/ai.routes.ts`:

```typescript
import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { requireAuth } from '@/middleware/auth.middleware';
import { rateLimitByPlan } from '@/middleware/rate-limit.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

// Rate limiting basado en plan del usuario
router.use(rateLimitByPlan('ai'));

// Generar código
router.post('/generate', aiController.generateCode);

// Refactorizar código
router.post('/refactor', aiController.refactorCode);

// Explicar código
router.post('/explain', aiController.explainCode);

// Analizar código
router.post('/analyze', aiController.analyzeCode);

// Autocompletado
router.post('/complete', aiController.completeCode);

export default router;
```

### 4. Controller

Crear `backend/src/api/controllers/ai.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { joxCoderService } from '@/services/ai-integration/joxcoder.service';
import { logger } from '@/utils/logger';
import { z } from 'zod';

// Validation schemas
const generateSchema = z.object({
  prompt: z.string().min(1).max(5000),
  context: z
    .object({
      language: z.string().optional(),
      framework: z.string().optional(),
      projectId: z.string().optional(),
    })
    .optional(),
});

const refactorSchema = z.object({
  code: z.string().min(1),
  instructions: z.string().min(1).max(1000),
});

const explainSchema = z.object({
  code: z.string().min(1),
});

const analyzeSchema = z.object({
  code: z.string().min(1),
  language: z.string(),
});

const completeSchema = z.object({
  code: z.string(),
  cursorPosition: z.object({
    line: z.number(),
    column: z.number(),
  }),
  language: z.string(),
});

class AIController {
  /**
   * POST /api/ai/generate
   * Generar código con IA
   */
  async generateCode(req: Request, res: Response) {
    try {
      const { prompt, context } = generateSchema.parse(req.body);

      const result = await joxCoderService.generateCode({
        prompt,
        context,
      });

      logger.info('Code generated successfully', {
        userId: req.auth.userId,
        promptLength: prompt.length,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Generate code error', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to generate code',
      });
    }
  }

  /**
   * POST /api/ai/refactor
   * Refactorizar código
   */
  async refactorCode(req: Request, res: Response) {
    try {
      const { code, instructions } = refactorSchema.parse(req.body);

      const result = await joxCoderService.refactorCode(code, instructions);

      logger.info('Code refactored successfully', {
        userId: req.auth.userId,
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Refactor code error', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to refactor code',
      });
    }
  }

  /**
   * POST /api/ai/explain
   * Explicar código
   */
  async explainCode(req: Request, res: Response) {
    try {
      const { code } = explainSchema.parse(req.body);

      const result = await joxCoderService.explainCode(code);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Explain code error', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to explain code',
      });
    }
  }

  /**
   * POST /api/ai/analyze
   * Analizar código
   */
  async analyzeCode(req: Request, res: Response) {
    try {
      const { code, language } = analyzeSchema.parse(req.body);

      const result = await joxCoderService.analyzeCode(code, language);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Analyze code error', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to analyze code',
      });
    }
  }

  /**
   * POST /api/ai/complete
   * Autocompletar código
   */
  async completeCode(req: Request, res: Response) {
    try {
      const { code, cursorPosition, language } = completeSchema.parse(req.body);

      const result = await joxCoderService.completeCode(code, cursorPosition, language);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Complete code error', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to complete code',
      });
    }
  }
}

export const aiController = new AIController();
```

---

## Frontend Integration

### 1. API Client

Crear `frontend/src/lib/api/ai.ts`:

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface GenerateCodeRequest {
  prompt: string;
  context?: {
    language?: string;
    framework?: string;
    projectId?: string;
  };
}

export interface GenerateCodeResponse {
  code: string;
  explanation?: string;
  suggestions?: string[];
  confidence: number;
}

export const aiApi = {
  async generateCode(request: GenerateCodeRequest, token: string): Promise<GenerateCodeResponse> {
    const response = await axios.post(
      `${API_URL}/api/ai/generate`,
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },

  async refactorCode(code: string, instructions: string, token: string) {
    const response = await axios.post(
      `${API_URL}/api/ai/refactor`,
      { code, instructions },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },

  async explainCode(code: string, token: string) {
    const response = await axios.post(
      `${API_URL}/api/ai/explain`,
      { code },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },

  async analyzeCode(code: string, language: string, token: string) {
    const response = await axios.post(
      `${API_URL}/api/ai/analyze`,
      { code, language },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },
};
```

### 2. React Hook

Crear `frontend/src/hooks/use-ai.ts`:

```typescript
import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { aiApi, GenerateCodeRequest } from '@/lib/api/ai';
import { toast } from 'sonner';

export function useAI() {
  const { getToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCode = async (request: GenerateCodeRequest) => {
    setIsGenerating(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const result = await aiApi.generateCode(request, token);
      toast.success('Code generated successfully!');
      return result;
    } catch (error) {
      toast.error('Failed to generate code');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const refactorCode = async (code: string, instructions: string) => {
    setIsGenerating(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const result = await aiApi.refactorCode(code, instructions, token);
      toast.success('Code refactored successfully!');
      return result;
    } catch (error) {
      toast.error('Failed to refactor code');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const explainCode = async (code: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      return await aiApi.explainCode(code, token);
    } catch (error) {
      toast.error('Failed to explain code');
      throw error;
    }
  };

  const analyzeCode = async (code: string, language: string) => {
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      return await aiApi.analyzeCode(code, language, token);
    } catch (error) {
      toast.error('Failed to analyze code');
      throw error;
    }
  };

  return {
    generateCode,
    refactorCode,
    explainCode,
    analyzeCode,
    isGenerating,
  };
}
```

---

## Rate Limiting

Limitar requests de IA según el plan del usuario:

```typescript
// backend/src/middleware/rate-limit.middleware.ts

export const AI_RATE_LIMITS = {
  free: {
    maxRequests: 100,
    windowMs: 30 * 24 * 60 * 60 * 1000, // 30 días
  },
  pro: {
    maxRequests: 1000,
    windowMs: 30 * 24 * 60 * 60 * 1000,
  },
  enterprise: {
    maxRequests: Infinity,
    windowMs: 0,
  },
};
```

---

## Testing

### Unit Tests

```typescript
// backend/tests/services/joxcoder.service.test.ts

import { joxCoderService } from '@/services/ai-integration/joxcoder.service';

describe('JoxCoderService', () => {
  it('should generate code from prompt', async () => {
    const result = await joxCoderService.generateCode({
      prompt: 'Create a React button component',
      context: {
        language: 'typescript',
        framework: 'react',
      },
    });

    expect(result.code).toBeDefined();
    expect(result.code).toContain('button');
  });

  it('should refactor code', async () => {
    const code = 'function add(a,b){return a+b}';
    const result = await joxCoderService.refactorCode(
      code,
      'Add TypeScript types'
    );

    expect(result.code).toContain('number');
  });
});
```

---

## Monitoring

### Logs

Todos los requests a JoxCoder son loggeados:

```typescript
logger.info('JoxCoder request', {
  userId,
  endpoint: '/generate',
  promptLength: prompt.length,
  timestamp: new Date().toISOString(),
});
```

### Metrics

Trackear:
- Número de requests por usuario
- Tiempo de respuesta
- Tokens utilizados
- Errores

---

## Error Handling

```typescript
try {
  const result = await joxCoderService.generateCode(request);
  return result;
} catch (error) {
  if (error.response?.status === 429) {
    throw new Error('Rate limit exceeded');
  } else if (error.response?.status === 401) {
    throw new Error('Invalid API key');
  } else {
    throw new Error('AI service unavailable');
  }
}
```

---

## Best Practices

1. **Timeout:** Siempre usar timeout en requests (30s recomendado)
2. **Retry Logic:** Implementar retry con exponential backoff
3. **Caching:** Cachear respuestas frecuentes
4. **Validation:** Validar inputs antes de enviar a IA
5. **Sanitization:** Sanitizar outputs de la IA
6. **Monitoring:** Trackear uso y costos
7. **Fallback:** Tener fallback si IA falla

---

## Deployment Checklist

- [ ] JoxCoder API deployed y accesible
- [ ] API Key configurada en Railway env vars
- [ ] Feature flag `ENABLE_AI_GENERATION=true`
- [ ] Rate limiting configurado
- [ ] Logging configurado
- [ ] Error handling implementado
- [ ] Frontend hooks funcionando
- [ ] Tests pasando
- [ ] Monitoring configurado

---

## Soporte

Para issues con JoxCoder:
- Email: support@joxai.org
- Docs: https://docs.joxai.org/joxcoder

---

**Desarrollado por JoxAI** 🚀
