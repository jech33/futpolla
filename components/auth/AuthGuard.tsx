'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from '../ui/Spinner';

const PUBLIC_ROUTES = ['/login']; // Rutas donde NO exigimos auth

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initializeAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!user && !PUBLIC_ROUTES.includes(pathname)) {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/');
      }

      setIsChecking(false);
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading || isChecking) {
    return (
      <div className="flex min-h-screen animate-pulse flex-col items-center justify-center gap-5 bg-white">
        <h1 className="text-4xl font-black tracking-tighter text-black italic">
          FUT<span className="text-green-500">POLLA</span>
        </h1>
        <Spinner className="size-12 text-gray-500" />
      </div>
    );
  }

  if (!user && !PUBLIC_ROUTES.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
