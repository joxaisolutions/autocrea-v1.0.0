'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Code2,
  LayoutDashboard,
  FolderKanban,
  Settings,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    name: 'AI Assistant',
    href: '/ai',
    icon: Sparkles,
    badge: 'New',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto glass border-r border-electric-500/10 px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center space-x-2">
          <Code2 className="h-8 w-8 text-electric-500" />
          <span className="text-xl font-bold gradient-text">AUTOCREA</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 transition-all',
                          isActive
                            ? 'bg-electric-500/20 text-white border border-electric-500/50 glow'
                            : 'text-gray-300 hover:text-white hover:bg-electric-500/10 hover:border hover:border-electric-500/20'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isActive ? 'text-electric-500' : 'text-gray-400 group-hover:text-electric-500'
                          )}
                        />
                        {item.name}
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className="ml-auto bg-electric-500/20 text-electric-500 border-electric-500/50"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            {/* Bottom Section */}
            <li className="mt-auto">
              <div className="glass rounded-lg p-4 border border-electric-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-electric-500" />
                  <span className="text-sm font-semibold">Free Trial</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  3 projects • 100 AI requests
                </p>
                <Link
                  href="/billing"
                  className="btn-primary w-full text-center text-sm py-2 block"
                >
                  Upgrade to Pro
                </Link>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
