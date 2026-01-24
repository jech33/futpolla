'use client';

import { useAuthStore } from '@/stores/useAuthStore';

export default function Login() {
  const login = useAuthStore((state) => state.loginWithGoogle);
  const loadingAuth = useAuthStore((state) => state.isLoading);
  const handleLogin = async () => {
    await login();
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-white">
      <h1 className="text-4xl font-black tracking-tighter text-black italic">
        FUT<span className="text-green-500">POLLA</span>
      </h1>
      <button
        onClick={handleLogin}
        disabled={loadingAuth}
        className="cursor-pointer rounded bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600 disabled:opacity-50"
      >
        Google Login
      </button>
    </div>
  );
}
