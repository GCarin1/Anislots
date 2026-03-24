export type WaifuRarity = 'common' | 'rare' | 'legendary';

export interface WaifuTheme {
  id: string;
  name: string;
  tagline: string;
  rarity: WaifuRarity;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    background: string;
  };
  cssVars: Record<string, string>;
  emoji: string;
  imageUrl: string;
  symbolSet: string;
}
