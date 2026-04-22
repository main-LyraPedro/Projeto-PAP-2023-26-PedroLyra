/* ─────────────────────────────────────────────────────────────
   EcoChat — Central Theme Tokens
   Usar: const T = theme(isDarkMode)
   ───────────────────────────────────────────────────────────── */

export interface Theme {
  // Backgrounds
  bg: string;
  bgSurface: string;
  bgCard: string;
  bgCardHover: string;
  bgInput: string;
  // Borders
  border: string;
  borderStrong: string;
  // Text
  text: string;
  textSub: string;
  textMuted: string;
  // Accent (green)
  accent: string;
  accentSub: string;
  accentBorder: string;
  // Sidebar
  sidebarBg: string;
  sidebarBorder: string;
  sidebarItemActive: string;
  sidebarItemActiveBorder: string;
  sidebarText: string;
  sidebarTextMuted: string;
  // Nav
  navBg: string;
}

export function theme(dark: boolean): Theme {
  if (dark) {
    return {
      bg: '#040f07',
      bgSurface: '#060e08',
      bgCard: 'rgba(255,255,255,0.03)',
      bgCardHover: 'rgba(255,255,255,0.05)',
      bgInput: 'rgba(255,255,255,0.05)',
      border: 'rgba(255,255,255,0.08)',
      borderStrong: 'rgba(255,255,255,0.14)',
      text: '#ffffff',
      textSub: 'rgba(255,255,255,0.65)',
      textMuted: 'rgba(255,255,255,0.35)',
      accent: '#10b981',
      accentSub: 'rgba(16,185,129,0.14)',
      accentBorder: 'rgba(16,185,129,0.32)',
      sidebarBg: 'linear-gradient(180deg,#081a0f 0%,#050f08 100%)',
      sidebarBorder: 'rgba(16,185,129,0.12)',
      sidebarItemActive: 'rgba(16,185,129,0.15)',
      sidebarItemActiveBorder: 'rgba(16,185,129,0.3)',
      sidebarText: '#ffffff',
      sidebarTextMuted: 'rgba(255,255,255,0.4)',
      navBg: 'rgba(4,15,7,0.9)',
    };
  }
  return {
    bg: '#f0faf4',
    bgSurface: '#ffffff',
    bgCard: '#ffffff',
    bgCardHover: '#f7fdf9',
    bgInput: '#ffffff',
    border: 'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(0,0,0,0.15)',
    text: '#0d1f14',
    textSub: '#374151',
    textMuted: '#9ca3af',
    accent: '#059669',
    accentSub: 'rgba(5,150,105,0.1)',
    accentBorder: 'rgba(5,150,105,0.3)',
    sidebarBg: 'linear-gradient(180deg,#f0fdf4 0%,#ffffff 100%)',
    sidebarBorder: 'rgba(5,150,105,0.15)',
    sidebarItemActive: 'rgba(5,150,105,0.1)',
    sidebarItemActiveBorder: 'rgba(5,150,105,0.35)',
    sidebarText: '#0d1f14',
    sidebarTextMuted: '#6b7280',
    navBg: 'rgba(240,250,244,0.92)',
  };
}
