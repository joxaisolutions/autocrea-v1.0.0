import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export interface TerminalSession {
  id: string;
  process: ChildProcess;
  cwd: string;
  userId: string;
  projectId?: string;
}

class TerminalManager extends EventEmitter {
  private sessions: Map<string, TerminalSession> = new Map();

  /**
   * Create a new terminal session
   */
  createSession(
    sessionId: string,
    userId: string,
    projectId?: string,
    cwd?: string
  ): TerminalSession {
    // Use bash on Unix, cmd on Windows
    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/bash';
    const workingDir = cwd || process.cwd();

    const terminalProcess = spawn(shell, [], {
      cwd: workingDir,
      env: {
        ...process.env,
        TERM: 'xterm-256color',
      },
    });

    const session: TerminalSession = {
      id: sessionId,
      process: terminalProcess,
      cwd: workingDir,
      userId,
      projectId,
    };

    this.sessions.set(sessionId, session);

    // Handle process output
    terminalProcess.stdout?.on('data', (data) => {
      this.emit(`output:${sessionId}`, {
        stream: 'stdout',
        data: data.toString(),
      });
    });

    terminalProcess.stderr?.on('data', (data) => {
      this.emit(`output:${sessionId}`, {
        stream: 'stderr',
        data: data.toString(),
      });
    });

    terminalProcess.on('exit', (code, signal) => {
      this.emit(`exit:${sessionId}`, { code, signal });
      this.sessions.delete(sessionId);
    });

    terminalProcess.on('error', (error) => {
      this.emit(`error:${sessionId}`, { error: error.message });
    });

    return session;
  }

  /**
   * Execute a command in a terminal session
   */
  executeCommand(sessionId: string, command: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    try {
      session.process.stdin?.write(command + '\n');
      return true;
    } catch (error) {
      console.error('Error executing command:', error);
      return false;
    }
  }

  /**
   * Send input to a terminal session
   */
  sendInput(sessionId: string, input: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    try {
      session.process.stdin?.write(input);
      return true;
    } catch (error) {
      console.error('Error sending input:', error);
      return false;
    }
  }

  /**
   * Resize terminal
   */
  resizeTerminal(sessionId: string, cols: number, rows: number): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    try {
      // @ts-ignore - resize is available on pty processes
      if (session.process.resize) {
        session.process.resize(cols, rows);
      }
      return true;
    } catch (error) {
      console.error('Error resizing terminal:', error);
      return false;
    }
  }

  /**
   * Kill a terminal session
   */
  killSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    try {
      session.process.kill();
      this.sessions.delete(sessionId);
      return true;
    } catch (error) {
      console.error('Error killing session:', error);
      return false;
    }
  }

  /**
   * Get a terminal session
   */
  getSession(sessionId: string): TerminalSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(userId: string): TerminalSession[] {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId
    );
  }

  /**
   * Clean up all sessions
   */
  cleanup(): void {
    for (const [sessionId, session] of this.sessions.entries()) {
      try {
        session.process.kill();
      } catch (error) {
        console.error(`Error killing session ${sessionId}:`, error);
      }
    }
    this.sessions.clear();
  }
}

export const terminalManager = new TerminalManager();

// Cleanup on process exit
process.on('SIGTERM', () => {
  terminalManager.cleanup();
});

process.on('SIGINT', () => {
  terminalManager.cleanup();
  process.exit(0);
});
