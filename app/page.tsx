import Link from 'next/link';

export default function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4"
      style={{ background: 'var(--app-bg)' }}
    >
      <div className="max-w-2xl text-center">
        <h1
          className="text-5xl font-black text-glow-waifu md:text-7xl"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
        >
          AniSlots
        </h1>
        <p className="mt-4 text-xl" style={{ color: 'var(--app-text-muted)' }}>
          O caça-níquel com estética anime waifu. Escolha sua waifu, gire os rolos e ganhe!
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-4xl">
          <span className="float" style={{ animationDelay: '0s' }}>
            🌸
          </span>
          <span className="float" style={{ animationDelay: '0.5s' }}>
            🌙
          </span>
          <span className="float" style={{ animationDelay: '1s' }}>
            ❄️
          </span>
          <span className="float" style={{ animationDelay: '1.5s' }}>
            🌺
          </span>
          <span className="float" style={{ animationDelay: '2s' }}>
            🔥
          </span>
          <span className="float" style={{ animationDelay: '2.5s' }}>
            ⚡
          </span>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex rounded-2xl px-8 py-4 text-lg font-bold text-white shadow-lg glow-waifu"
            style={{
              background: 'linear-gradient(135deg, var(--waifu-primary), var(--waifu-secondary))',
            }}
          >
            Criar Conta Grátis
          </Link>
          <Link
            href="/login"
            className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-medium transition-colors hover:bg-white/10"
          >
            Entrar
          </Link>
        </div>

        <p className="mt-6 text-sm" style={{ color: 'var(--app-text-muted)' }}>
          Ganhe 10.000 moedas de boas-vindas ao se registrar!
        </p>
      </div>

      {/* Features */}
      <div className="mt-16 grid max-w-4xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
        {[
          {
            icon: '🎰',
            title: '20 Paylines',
            desc: 'Grid 5x3 com 20 linhas de pagamento e sistema de wild/scatter',
          },
          {
            icon: '🏆',
            title: 'Jackpot Progressivo',
            desc: 'Jackpot em tempo real que cresce a cada spin de todos os jogadores',
          },
          {
            icon: '💬',
            title: 'Chat ao Vivo',
            desc: 'Converse com outros jogadores em tempo real enquanto joga',
          },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-6 text-center">
            <span className="text-3xl">{f.icon}</span>
            <h3 className="mt-2 text-lg font-bold">{f.title}</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--app-text-muted)' }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
