import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components/native';

import { theme } from './theme';

export function AppThemeProvider({ children }: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
