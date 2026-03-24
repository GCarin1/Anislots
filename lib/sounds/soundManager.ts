import { Howl, Howler } from 'howler';

export type SoundKey =
  | 'background'
  | 'spin_start'
  | 'reel_stop_1'
  | 'reel_stop_2'
  | 'reel_stop_3'
  | 'reel_stop_4'
  | 'reel_stop_5'
  | 'win_small'
  | 'win_big'
  | 'win_mega'
  | 'jackpot'
  | 'bonus_enter'
  | 'bonus_reveal'
  | 'chat_ping';

const SOUNDS: Record<SoundKey, { src: string; loop?: boolean; volume?: number }> = {
  background: { src: '/sounds/background.mp3', loop: true, volume: 0.3 },
  spin_start: { src: '/sounds/spin_start.mp3', volume: 0.7 },
  reel_stop_1: { src: '/sounds/reel_stop_1.mp3', volume: 0.6 },
  reel_stop_2: { src: '/sounds/reel_stop_2.mp3', volume: 0.6 },
  reel_stop_3: { src: '/sounds/reel_stop_3.mp3', volume: 0.6 },
  reel_stop_4: { src: '/sounds/reel_stop_4.mp3', volume: 0.6 },
  reel_stop_5: { src: '/sounds/reel_stop_5.mp3', volume: 0.6 },
  win_small: { src: '/sounds/win_small.mp3', volume: 0.7 },
  win_big: { src: '/sounds/win_big.mp3', volume: 0.8 },
  win_mega: { src: '/sounds/win_mega.mp3', volume: 0.9 },
  jackpot: { src: '/sounds/jackpot.mp3', volume: 1.0 },
  bonus_enter: { src: '/sounds/bonus_enter.mp3', volume: 0.8 },
  bonus_reveal: { src: '/sounds/bonus_reveal.mp3', volume: 0.8 },
  chat_ping: { src: '/sounds/chat_ping.mp3', volume: 0.4 },
};

class SoundManager {
  private howls = new Map<SoundKey, Howl>();
  private muted = false;
  private volume = 0.7;

  preload(keys: SoundKey[]) {
    keys.forEach((key) => {
      if (!this.howls.has(key)) {
        const config = SOUNDS[key];
        this.howls.set(
          key,
          new Howl({
            src: [config.src],
            loop: config.loop ?? false,
            volume: (config.volume ?? 1) * this.volume,
            preload: true,
          }),
        );
      }
    });
  }

  play(key: SoundKey) {
    if (this.muted) return;
    const howl = this.howls.get(key);
    if (howl) {
      howl.play();
    } else {
      const config = SOUNDS[key];
      const h = new Howl({
        src: [config.src],
        loop: config.loop,
        volume: (config.volume ?? 1) * this.volume,
      });
      this.howls.set(key, h);
      h.play();
    }
  }

  stop(key: SoundKey) {
    this.howls.get(key)?.stop();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    Howler.mute(muted);
  }

  isMuted() {
    return this.muted;
  }

  setVolume(vol: number) {
    this.volume = vol;
    Howler.volume(vol);
  }

  getVolume() {
    return this.volume;
  }
}

export const soundManager = new SoundManager();
