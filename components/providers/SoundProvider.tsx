'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import { soundManager, type SoundKey } from '@/lib/sounds/soundManager';

interface SoundContextType {
  play: (key: SoundKey) => void;
  stop: (key: SoundKey) => void;
  muted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (vol: number) => void;
}

const SoundContext = createContext<SoundContextType>({
  play: () => {},
  stop: () => {},
  muted: false,
  toggleMute: () => {},
  volume: 0.7,
  setVolume: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.7);

  const play = useCallback((key: SoundKey) => soundManager.play(key), []);
  const stop = useCallback((key: SoundKey) => soundManager.stop(key), []);

  const toggleMute = useCallback(() => {
    const newMuted = !muted;
    soundManager.setMuted(newMuted);
    setMuted(newMuted);
  }, [muted]);

  const setVolume = useCallback((vol: number) => {
    soundManager.setVolume(vol);
    setVolumeState(vol);
  }, []);

  return (
    <SoundContext.Provider value={{ play, stop, muted, toggleMute, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
