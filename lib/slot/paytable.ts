import type { SymbolId } from './symbols';

// Multiplicadores: símbolo → quantidade em linha → multiplicador da aposta
export const PAYTABLE: Record<SymbolId, Record<number, number>> = {
  wild: { 2: 12, 3: 125, 4: 500, 5: 2500 },
  scatter: { 3: 5, 4: 12, 5: 50 },
  seven: { 3: 50, 4: 250, 5: 750 },
  gem_red: { 3: 38, 4: 188, 5: 500 },
  gem_blue: { 3: 30, 4: 150, 5: 375 },
  gem_purple: { 3: 25, 4: 100, 5: 250 },
  heart: { 3: 12, 4: 50, 5: 125 },
  star: { 3: 8, 4: 25, 5: 62 },
  cherry: { 2: 4, 3: 5, 4: 12, 5: 25 },
};
