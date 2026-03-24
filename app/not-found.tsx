import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1
        className="text-6xl font-black"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
      >
        404
      </h1>
      <p style={{ color: 'var(--app-text-muted)' }}>Página não encontrada</p>
      <Link
        href="/"
        className="rounded-xl px-6 py-3 font-bold text-white"
        style={{ background: 'var(--waifu-primary)' }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}
