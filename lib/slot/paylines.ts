// Paylines: arrays de índices de linha por coluna (0=top, 1=mid, 2=bottom)
// 5 colunas × 3 linhas
export type Payline = [number, number, number, number, number];

export const PAYLINES: Payline[] = [
  [1, 1, 1, 1, 1], // 0: linha do meio
  [0, 0, 0, 0, 0], // 1: linha do topo
  [2, 2, 2, 2, 2], // 2: linha de baixo
  [0, 1, 2, 1, 0], // 3: V shape
  [2, 1, 0, 1, 2], // 4: A shape
  [0, 0, 1, 2, 2], // 5: diagonal down-right
  [2, 2, 1, 0, 0], // 6: diagonal up-right
  [1, 0, 0, 0, 1], // 7
  [1, 2, 2, 2, 1], // 8
  [0, 1, 1, 1, 0], // 9
  [2, 1, 1, 1, 2], // 10
  [1, 0, 1, 0, 1], // 11: zigzag top
  [1, 2, 1, 2, 1], // 12: zigzag bottom
  [0, 1, 0, 1, 0], // 13
  [2, 1, 2, 1, 2], // 14
  [1, 1, 0, 1, 1], // 15
  [1, 1, 2, 1, 1], // 16
  [0, 2, 0, 2, 0], // 17
  [2, 0, 2, 0, 2], // 18
  [1, 0, 2, 0, 1], // 19
];
