export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
          Welcome to <span className="text-blue-600">Futpolla!</span>
        </h1>
        <p className="mt-6 text-lg text-gray-700 dark:text-gray-300">
          Your ultimate platform for football enthusiasts.
        </p>
      </main>
    </div>
  );
}
