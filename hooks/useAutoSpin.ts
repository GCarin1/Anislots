'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store/gameStore';
import { useSlot } from './useSlot';

export function useAutoSpin() {
  const { autoSpinActive, autoSpinRemaining, spinState, stopAutoSpin, startAutoSpin } =
    useGameStore();
  const { executeSpin, canSpin } = useSlot();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoSpinActive && canSpin && autoSpinRemaining > 0) {
      intervalRef.current = setTimeout(() => {
        executeSpin();
      }, 500);
    }

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [autoSpinActive, canSpin, autoSpinRemaining, spinState, executeSpin]);

  return { autoSpinActive, autoSpinRemaining, startAutoSpin, stopAutoSpin };
}
