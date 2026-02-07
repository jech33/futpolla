'use client';

import { cn } from '@/lib/utils';
import { loginWithGoogle } from '@/services/authServices';
import { useState } from 'react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
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
        Google Login
      </button>
    </main>
  );
}
