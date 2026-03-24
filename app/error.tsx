'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1
        className="text-4xl font-black"
        style={{ fontFamily: 'var(--font-display)', color: '#f43f5e' }}
      >
        Ops! Algo deu errado
      </h1>
      <p style={{ color: 'var(--app-text-muted)' }}>{error.message}</p>
      <button
        onClick={reset}
        className="rounded-xl bg-white/10 px-6 py-3 font-bold transition-colors hover:bg-white/20"
      >
        Tentar novamente
      </button>
    </div>
  );
}
