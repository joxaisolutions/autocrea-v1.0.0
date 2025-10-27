'use client';

import { UserButton } from '@clerk/nextjs';
import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-electric-500/10 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-x-4 px-6">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="flex flex-1 gap-x-4 lg:gap-x-6">
          <div className="relative flex flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full pl-10 bg-navy-400 border-electric-500/20 focus:border-electric-500"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-x-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-9 w-9 ring-2 ring-electric-500/50',
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
