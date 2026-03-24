'use client';

import { useCallback, useState } from 'react';
import { soundManager, type SoundKey } from '@/lib/sounds/soundManager';

export function useSound() {
  const [muted, setMuted] = useState(false);

  const play = useCallback((key: SoundKey) => {
    soundManager.play(key);
  }, []);

  const stop = useCallback((key: SoundKey) => {
    soundManager.stop(key);
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = !soundManager.isMuted();
    soundManager.setMuted(newMuted);
    setMuted(newMuted);
  }, []);

  const setVolume = useCallback((vol: number) => {
    soundManager.setVolume(vol);
  }, []);

  return { play, stop, muted, toggleMute, setVolume };
}
