import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/providers/convex-provider';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AUTOCREA - AI-Powered Web Development Platform',
  description:
    'Create complete web applications (0-100) without writing code. Powered by JoxCoder AI.',
  keywords: [
    'ai',
    'code generation',
    'web development',
    'no-code',
    'joxai',
    'autocrea',
    'joxcoder',
  ],
  authors: [{ name: 'JoxAI', url: 'https://joxai.org' }],
  creator: 'JoxAI',
  publisher: 'JoxAI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    title: 'AUTOCREA - AI-Powered Web Development Platform',
    description:
      'Create complete web applications (0-100) without writing code. Powered by JoxCoder AI.',
    siteName: 'AUTOCREA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AUTOCREA - AI-Powered Web Development Platform',
    description:
      'Create complete web applications (0-100) without writing code. Powered by JoxCoder AI.',
    creator: '@joxai',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0066FF',
          colorBackground: '#0A1628',
          colorText: '#FFFFFF',
          colorTextSecondary: '#E2E8F0',
        },
        elements: {
          formButtonPrimary: 'bg-electric-500 hover:bg-electric-600 text-white',
          card: 'glass',
          headerTitle: 'gradient-text',
          headerSubtitle: 'text-muted-foreground',
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1A2C48',
                color: '#FFFFFF',
                border: '1px solid #0066FF',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
