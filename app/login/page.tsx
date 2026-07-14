'use client';

import { useState } from 'react';

import { authenticateUserUseCase } from '@/composition/client';
import { cn } from '@/lib/utils';

export default function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authenticateUserUseCase.execute();
      // On success, user will be redirected by AuthGuard
    } catch (error) {
      console.error('Login error:', error);
      // TODO: Show error toast/message to user
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-white">
      <h1 className="text-4xl font-black tracking-tighter text-black italic">
        FUT<span className="text-green-500">POLLA</span>
      </h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className={cn(
          'cursor-pointer rounded bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-green-500'
        )}
      >
        {loading ? 'Logging in...' : 'Google Login'}
      </button>
    </main>
  );
}
