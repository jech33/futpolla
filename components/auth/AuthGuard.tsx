'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useInitializeAuth } from '@/hooks/useInitializeAuth';
import { PUBLIC_ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/useAuthStore';

import { Spinner } from '../ui/Spinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Initialize Firebase auth listener
  useInitializeAuth();

  const { isAuthenticated, isLoadingSession } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoadingSession) {
      const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);

      if (!isAuthenticated && !isPublicRoute) {
        router.push('/login');
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoadingSession, pathname, router]);

  if (isLoadingSession) {
    return (
      <div className="flex min-h-screen animate-pulse flex-col items-center justify-center gap-5 bg-slate-950">
        <h1 className="text-4xl font-black tracking-tighter text-white italic">
          FUT<span className="text-green-500">POLLA</span>
        </h1>
        <Spinner className="size-12 text-green-500" />
      </div>
    );
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
