'use client';

import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';

interface TerminalProps {
  onCommand?: (command: string) => void;
  className?: string;
}

export function Terminal({ onCommand, className }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !terminalRef.current) return;

    // Create terminal instance
    const xterm = new XTerm({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      lineHeight: 1.4,
      theme: {
        background: '#000000',
        foreground: '#ffffff',
        cursor: '#0066FF',
        cursorAccent: '#00D4FF',
        selectionBackground: 'rgba(0, 102, 255, 0.3)',
        black: '#000000',
        red: '#EF4444',
        green: '#10B981',
        yellow: '#F59E0B',
        blue: '#0066FF',
        magenta: '#A855F7',
        cyan: '#00D4FF',
        white: '#E2E8F0',
        brightBlack: '#4B5563',
        brightRed: '#F87171',
        brightGreen: '#34D399',
        brightYellow: '#FBBF24',
        brightBlue: '#3B82F6',
        brightMagenta: '#C084FC',
        brightCyan: '#22D3EE',
        brightWhite: '#F8FAFC',
      },
      allowTransparency: false,
      scrollback: 1000,
      tabStopWidth: 2,
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);

    // Open terminal
    xterm.open(terminalRef.current);
    fitAddon.fit();

    // Store refs
    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Welcome message
    xterm.writeln('\x1b[1;36m╔═══════════════════════════════════════════════╗\x1b[0m');
    xterm.writeln('\x1b[1;36m║\x1b[0m  \x1b[1;34mAUTOCREA Terminal\x1b[0m - Powered by JoxAI      \x1b[1;36m║\x1b[0m');
    xterm.writeln('\x1b[1;36m╚═══════════════════════════════════════════════╝\x1b[0m');
    xterm.writeln('');
    xterm.writeln('\x1b[1;32m✓\x1b[0m Terminal initialized successfully');
    xterm.writeln('\x1b[1;33m→\x1b[0m Type your commands below (simulation mode)');
    xterm.writeln('');
    xterm.write('\x1b[1;34m$\x1b[0m ');

    // Handle input
    let currentLine = '';
    xterm.onData((data) => {
      const code = data.charCodeAt(0);

      // Handle Enter
      if (code === 13) {
        xterm.writeln('');
        if (currentLine.trim()) {
          handleCommand(currentLine.trim(), xterm);
          if (onCommand) onCommand(currentLine.trim());
        }
        currentLine = '';
        xterm.write('\x1b[1;34m$\x1b[0m ');
      }
      // Handle Backspace
      else if (code === 127) {
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          xterm.write('\b \b');
        }
      }
      // Handle Ctrl+C
      else if (code === 3) {
        xterm.writeln('^C');
        currentLine = '';
        xterm.write('\x1b[1;34m$\x1b[0m ');
      }
      // Handle Ctrl+L (clear)
      else if (code === 12) {
        xterm.clear();
        currentLine = '';
        xterm.write('\x1b[1;34m$\x1b[0m ');
      }
      // Regular characters
      else {
        currentLine += data;
        xterm.write(data);
      }
    });

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      xterm.dispose();
    };
  }, [mounted, onCommand]);

  return <div ref={terminalRef} className={className} />;
}

// Simulate command execution (replace with real backend integration)
function handleCommand(command: string, xterm: XTerm) {
  const args = command.split(' ');
  const cmd = args[0];

  switch (cmd) {
    case 'help':
      xterm.writeln('');
      xterm.writeln('\x1b[1;36mAvailable Commands:\x1b[0m');
      xterm.writeln('  \x1b[1;32mhelp\x1b[0m      - Show this help message');
      xterm.writeln('  \x1b[1;32mclear\x1b[0m     - Clear the terminal');
      xterm.writeln('  \x1b[1;32mls\x1b[0m        - List files (simulated)');
      xterm.writeln('  \x1b[1;32mpwd\x1b[0m       - Print working directory');
      xterm.writeln('  \x1b[1;32mecho\x1b[0m      - Echo text');
      xterm.writeln('  \x1b[1;32mnpm\x1b[0m       - NPM commands (simulated)');
      xterm.writeln('  \x1b[1;32mgit\x1b[0m       - Git commands (simulated)');
      xterm.writeln('');
      xterm.writeln('\x1b[1;33mNote:\x1b[0m Terminal is in simulation mode.');
      xterm.writeln('Connect backend for real command execution.');
      xterm.writeln('');
      break;

    case 'clear':
      xterm.clear();
      break;

    case 'ls':
      xterm.writeln('');
      xterm.writeln('\x1b[1;34msrc/\x1b[0m');
      xterm.writeln('\x1b[1;34mpublic/\x1b[0m');
      xterm.writeln('package.json');
      xterm.writeln('README.md');
      xterm.writeln('.gitignore');
      xterm.writeln('');
      break;

    case 'pwd':
      xterm.writeln('');
      xterm.writeln('/workspace/my-project');
      xterm.writeln('');
      break;

    case 'echo':
      xterm.writeln('');
      xterm.writeln(args.slice(1).join(' '));
      xterm.writeln('');
      break;

    case 'npm':
      xterm.writeln('');
      xterm.writeln('\x1b[1;32m✓\x1b[0m npm command simulated: ' + args.join(' '));
      xterm.writeln('\x1b[1;33m→\x1b[0m Connect backend for real npm execution');
      xterm.writeln('');
      break;

    case 'git':
      xterm.writeln('');
      xterm.writeln('\x1b[1;32m✓\x1b[0m git command simulated: ' + args.join(' '));
      xterm.writeln('\x1b[1;33m→\x1b[0m Connect backend for real git execution');
      xterm.writeln('');
      break;

    default:
      xterm.writeln('');
      xterm.writeln(`\x1b[1;31mCommand not found:\x1b[0m ${cmd}`);
      xterm.writeln(`Type \x1b[1;32mhelp\x1b[0m for available commands`);
      xterm.writeln('');
      break;
  }
}
