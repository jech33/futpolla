'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore'; // 👈 Usamos el store ligero
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from '../ui/Spinner';

const PUBLIC_ROUTES = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoadingSession, initializeSession } = useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = initializeSession();
    return () => unsubscribe();
  }, [initializeSession]);

  useEffect(() => {
    if (!isLoadingSession) {
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

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

  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
