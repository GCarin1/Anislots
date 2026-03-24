'use client';

import { SlotGrid } from './SlotGrid';
import { BetControls } from './BetControls';
import { AutoSpinControls } from './AutoSpinControls';
import { SpinButton } from './SpinButton';
import { WinDisplay } from './WinDisplay';
import { PaylineDisplay } from './PaylineDisplay';
import { BonusRound } from './BonusRound';

export function SlotMachine() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Win Display */}
      <div className="min-h-[60px]">
        <WinDisplay />
      </div>

      {/* Slot Grid */}
      <div className="glass rounded-3xl p-4 md:p-6">
        <SlotGrid />
      </div>

      {/* Payline Display */}
      <div className="min-h-[32px]">
        <PaylineDisplay />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <BetControls />
        <SpinButton />
        <AutoSpinControls />
      </div>

      {/* Bonus Round Modal */}
      <BonusRound />
    </div>
  );
}
