'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ReactNode } from 'react';

// Use a dummy URL if CONVEX_URL is not set (for testing without Convex)
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || 'https://dummy.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  // If no real Convex URL, just return children without provider
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
