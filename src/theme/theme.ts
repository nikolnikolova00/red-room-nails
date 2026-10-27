import type { TextStyle } from 'react-native';

export const palette = {
  cream: '#FBF8F6',
  white: '#FFFFFF',
  blush: '#E8C4C0',
  blushSoft: '#F6EDEB',
  rose: '#C98B84',
  roseDark: '#B4766F',
  charcoal: '#2F2A28',
  taupe: '#8B7F7A',
  line: '#EEE3DF',
  danger: '#B4544C',
  success: '#5E7D63',
} as const;

const typography = {
  title: { fontSize: 30, lineHeight: 36, fontWeight: '600' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 23, fontWeight: '400' },
  label: { fontSize: 14, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
} satisfies Record<string, TextStyle>;

export const theme = {
  colors: {
    background: palette.cream,
    surface: palette.white,
    surfaceMuted: palette.blushSoft,
    primary: palette.rose,
    primaryPressed: palette.roseDark,
    accent: palette.blush,
    text: palette.charcoal,
    textMuted: palette.taupe,
    border: palette.line,
    danger: palette.danger,
    success: palette.success,
    onPrimary: palette.white,
    overlay: 'rgba(47, 42, 40, 0.4)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
    pill: 999,
  },
  typography,
  layout: {
    maxContentWidth: 640,
  },
} as const;

export type AppTheme = typeof theme;
