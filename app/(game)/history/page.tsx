'use client';

import { SpinHistoryTable } from '@/components/history/SpinHistoryTable';

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--waifu-primary)' }}
      >
        Histórico de Apostas
      </h1>
      <SpinHistoryTable />
    </div>
  );
}
