import { createHash } from 'crypto';
import { BASE_SYMBOLS, buildWeightedPool, type SymbolId } from './symbols';
import { PAYLINES, type Payline } from './paylines';
import { PAYTABLE } from './paytable';

const POOL = buildWeightedPool(BASE_SYMBOLS);
const COLS = 5;
const ROWS = 3;

export interface SpinResult {
  symbols: SymbolId[][];
  paylinesWon: WonPayline[];
  scatterCount: number;
  isBonusRound: boolean;
  isJackpot: boolean;
  payout: number;
  multiplier: number;
  totalSymbols: SymbolId[];
}

export interface WonPayline {
  index: number;
  payline: Payline;
  symbol: SymbolId;
  count: number;
  payout: number;
}

function seedRng(seed: string, nonce: number): () => number {
  let hash = createHash('sha256')
    .update(`${seed}:${nonce}:${Date.now()}`)
    .digest('hex');
  let pos = 0;

  return () => {
    const val = parseInt(hash.slice(pos, pos + 8), 16) / 0xffffffff;
    pos = (pos + 8) % 56;
    if (pos === 0) {
      hash = createHash('sha256').update(hash).digest('hex');
    }
    return val;
  };
}

function pickSymbol(rng: () => number): SymbolId {
  const idx = Math.floor(rng() * POOL.length);
  return POOL[idx];
}

export function spin(secret: string, nonce: number, betAmount: number): SpinResult {
  const rng = seedRng(secret, nonce);

  // Gerar grid 5 colunas × 3 linhas
  const symbols: SymbolId[][] = Array.from({ length: COLS }, () =>
    Array.from({ length: ROWS }, () => pickSymbol(rng)),
  );

  // Contar scatters no grid
  const flat = symbols.flat();
  const scatterCount = flat.filter((s) => s === 'scatter').length;
  const isBonusRound = scatterCount >= 3;

  // Avaliar paylines — bet é dividido pelas 20 linhas
  const paylinesWon: WonPayline[] = [];
  const betPerLine = betAmount / PAYLINES.length;

  for (let pi = 0; pi < PAYLINES.length; pi++) {
    const line = PAYLINES[pi];
    const lineSymbols = line.map((row, col) => symbols[col][row]);

    // Primeiro símbolo não-wild determina o símbolo avaliado
    const firstNonWild = lineSymbols.find((s) => s !== 'wild') ?? 'wild';

    let count = 0;
    for (const sym of lineSymbols) {
      if (sym === firstNonWild || sym === 'wild') {
        count++;
      } else {
        break;
      }
    }

    if (count >= 2 && PAYTABLE[firstNonWild]?.[count]) {
      const multiplier = PAYTABLE[firstNonWild][count];
      paylinesWon.push({
        index: pi,
        payline: line,
        symbol: firstNonWild,
        count,
        payout: Math.floor(betPerLine * multiplier),
      });
    }
  }

  // Scatter payout (usa bet total, independente de payline)
  if (scatterCount >= 3 && PAYTABLE.scatter[scatterCount]) {
    const scatterPay = Math.floor(betPerLine * PAYTABLE.scatter[scatterCount]);
    paylinesWon.push({
      index: -1,
      payline: [0, 0, 0, 0, 0],
      symbol: 'scatter',
      count: scatterCount,
      payout: scatterPay,
    });
  }

  const totalPayout = paylinesWon.reduce((acc, p) => acc + p.payout, 0);
  const totalMultiplier = betAmount > 0 ? totalPayout / betAmount : 0;

  // Jackpot: verificado server-side via probabilidade
  const jackpotProb = parseFloat(process.env.JACKPOT_WIN_PROBABILITY || '0.0001');
  const isJackpot = rng() < jackpotProb;

  return {
    symbols,
    paylinesWon,
    scatterCount,
    isBonusRound,
    isJackpot,
    payout: totalPayout,
    multiplier: parseFloat(totalMultiplier.toFixed(2)),
    totalSymbols: flat,
  };
}

export function resolveBonusRound(
  choice: 0 | 1 | 2,
  betAmount: number,
  secret: string,
  nonce: number,
) {
  const rng = seedRng(secret, nonce + 9999);
  const roll = rng();

  const prizes: Array<{ type: 'multiplier' | 'freespins'; value: number }> = [
    { type: 'multiplier', value: 2 },
    { type: 'multiplier', value: 5 },
    { type: 'multiplier', value: 10 },
    { type: 'multiplier', value: 25 },
    { type: 'multiplier', value: 50 },
    { type: 'freespins', value: 5 },
    { type: 'freespins', value: 10 },
    { type: 'freespins', value: 15 },
  ];

  const idx = Math.floor(roll * prizes.length);
  const reward = prizes[idx];
  const payout = reward.type === 'multiplier' ? betAmount * reward.value : 0;

  return { reward, payout };
}
