import { Code2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-300 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <Code2 className="h-8 w-8 text-electric-500" />
          <span className="text-2xl font-bold gradient-text">AUTOCREA</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 cyber-grid opacity-5"></div>
      </div>
    </div>
  );
}
