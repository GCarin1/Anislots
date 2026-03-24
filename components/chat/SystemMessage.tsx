'use client';

export function SystemMessage({ text }: { text: string }) {
  return (
    <div className="px-3 py-1 text-center text-xs font-medium" style={{ color: '#fbbf24' }}>
      {text}
    </div>
  );
}
