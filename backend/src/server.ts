import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Middleware
import { errorHandler } from '@/middleware/errorHandler';
import { apiLimiter } from '@/middleware/rateLimit';

// Routes
import projectsRouter from '@/routes/projects';
import filesRouter from '@/routes/files';
import aiRouter from '@/routes/ai';
import deployRouter from '@/routes/deploy';
import codeRouter from '@/routes/code';
import usersRouter from '@/routes/users';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const httpServer = createServer(app);

// Socket.IO server
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression()); // Compress responses
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies
app.use(morgan('combined')); // HTTP request logger
app.use(apiLimiter); // Rate limiting

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API info endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'AUTOCREA Backend API v1.0.0',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      projects: '/api/projects',
      files: '/api/files',
      code: '/api/code',
      ai: '/api/ai',
      deploy: '/api/deploy',
    },
  });
});

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/files', filesRouter);
app.use('/api/code', codeRouter);
app.use('/api/ai', aiRouter);
app.use('/api/deploy', deployRouter);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  // Terminal events
  socket.on('terminal:command', (data) => {
    console.log('Terminal command:', data);
    // TODO: Handle terminal command execution
    socket.emit('terminal:output', { output: 'Command received\n', stream: 'stdout' });
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`🚀 AUTOCREA Backend Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { app, io };
