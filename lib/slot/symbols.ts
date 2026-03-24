export type SymbolId =
  | 'wild'
  | 'scatter'
  | 'gem_red'
  | 'gem_blue'
  | 'gem_purple'
  | 'heart'
  | 'star'
  | 'cherry'
  | 'seven';

export interface SlotSymbol {
  id: SymbolId;
  label: string;
  emoji: string;
  weight: number;
  isWild?: boolean;
  isScatter?: boolean;
}

export const BASE_SYMBOLS: SlotSymbol[] = [
  { id: 'wild', label: 'Wild', emoji: '⭐', weight: 2, isWild: true },
  { id: 'scatter', label: 'Scatter', emoji: '💫', weight: 3, isScatter: true },
  { id: 'seven', label: 'Seven', emoji: '7️⃣', weight: 5 },
  { id: 'gem_red', label: 'Ruby', emoji: '🔴', weight: 8 },
  { id: 'gem_blue', label: 'Sapphire', emoji: '🔵', weight: 8 },
  { id: 'gem_purple', label: 'Amethyst', emoji: '🟣', weight: 10 },
  { id: 'heart', label: 'Heart', emoji: '💖', weight: 15 },
  { id: 'star', label: 'Star', emoji: '✨', weight: 20 },
  { id: 'cherry', label: 'Cherry', emoji: '🍒', weight: 29 },
];

// Total weight = 100
export function buildWeightedPool(symbols: SlotSymbol[]): SymbolId[] {
  return symbols.flatMap((s) => Array(s.weight).fill(s.id));
}
