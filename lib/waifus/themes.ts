import type { WaifuTheme } from '@/types/waifu';

export const WAIFU_THEMES: WaifuTheme[] = [
  {
    id: 'sakura',
    name: 'Sakura',
    tagline: 'A Flor da Primavera',
    rarity: 'common',
    emoji: '🌸',
    imageUrl: '/waifus/sakura/portrait.webp',
    symbolSet: 'sakura',
    colors: {
      primary: '#ff6eb4',
      secondary: '#ffd6e7',
      accent: '#ff1493',
      glow: '#ff69b4',
      background: '#1a0010',
    },
    cssVars: {
      '--waifu-primary': '#ff6eb4',
      '--waifu-secondary': '#ffd6e7',
      '--waifu-glow': 'rgba(255,105,180,0.4)',
    },
  },
  {
    id: 'luna',
    name: 'Luna',
    tagline: 'A Guardiã da Lua',
    rarity: 'rare',
    emoji: '🌙',
    imageUrl: '/waifus/luna/portrait.webp',
    symbolSet: 'luna',
    colors: {
      primary: '#c084fc',
      secondary: '#e9d5ff',
      accent: '#9333ea',
      glow: '#a855f7',
      background: '#0d0020',
    },
    cssVars: {
      '--waifu-primary': '#c084fc',
      '--waifu-secondary': '#e9d5ff',
      '--waifu-glow': 'rgba(168,85,247,0.4)',
    },
  },
  {
    id: 'yuki',
    name: 'Yuki',
    tagline: 'A Princesa do Gelo',
    rarity: 'common',
    emoji: '❄️',
    imageUrl: '/waifus/yuki/portrait.webp',
    symbolSet: 'yuki',
    colors: {
      primary: '#7dd3fc',
      secondary: '#e0f2fe',
      accent: '#0284c7',
      glow: '#38bdf8',
      background: '#00101a',
    },
    cssVars: {
      '--waifu-primary': '#7dd3fc',
      '--waifu-secondary': '#e0f2fe',
      '--waifu-glow': 'rgba(56,189,248,0.4)',
    },
  },
  {
    id: 'hana',
    name: 'Hana',
    tagline: 'A Feiticeira das Flores',
    rarity: 'common',
    emoji: '🌺',
    imageUrl: '/waifus/hana/portrait.webp',
    symbolSet: 'hana',
    colors: {
      primary: '#86efac',
      secondary: '#dcfce7',
      accent: '#16a34a',
      glow: '#4ade80',
      background: '#001a09',
    },
    cssVars: {
      '--waifu-primary': '#86efac',
      '--waifu-secondary': '#dcfce7',
      '--waifu-glow': 'rgba(74,222,128,0.4)',
    },
  },
  {
    id: 'akira',
    name: 'Akira',
    tagline: 'A Guerreira das Chamas',
    rarity: 'rare',
    emoji: '🔥',
    imageUrl: '/waifus/akira/portrait.webp',
    symbolSet: 'akira',
    colors: {
      primary: '#fb923c',
      secondary: '#ffedd5',
      accent: '#ea580c',
      glow: '#f97316',
      background: '#1a0800',
    },
    cssVars: {
      '--waifu-primary': '#fb923c',
      '--waifu-secondary': '#ffedd5',
      '--waifu-glow': 'rgba(249,115,22,0.4)',
    },
  },
  {
    id: 'rei',
    name: 'Rei',
    tagline: 'A Imperatriz das Sombras',
    rarity: 'legendary',
    emoji: '⚡',
    imageUrl: '/waifus/rei/portrait.webp',
    symbolSet: 'rei',
    colors: {
      primary: '#fde047',
      secondary: '#fefce8',
      accent: '#ca8a04',
      glow: '#facc15',
      background: '#0d0d00',
    },
    cssVars: {
      '--waifu-primary': '#fde047',
      '--waifu-secondary': '#fefce8',
      '--waifu-glow': 'rgba(250,204,21,0.4)',
    },
  },
];

export function getTheme(id: string): WaifuTheme {
  return WAIFU_THEMES.find((t) => t.id === id) ?? WAIFU_THEMES[0];
}
