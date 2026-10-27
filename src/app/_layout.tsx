import '@/i18n';

import { DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSettingsStore } from '@/store/settings';
import { theme } from '@/theme/theme';
import { AppThemeProvider } from '@/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
  },
};

export default function RootLayout() {
  const { t, i18n } = useTranslation();
  const language = useSettingsStore((state) => state.language);

  useEffect(() => {
    if (language && i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <AppThemeProvider>
      <NavigationThemeProvider value={navigationTheme}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.text,
            headerStyle: { backgroundColor: theme.colors.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="appointment/new"
            options={{ presentation: 'modal', headerShown: true, title: t('appointment.newTitle') }}
          />
          <Stack.Screen
            name="appointment/[id]"
            options={{ presentation: 'modal', headerShown: true, title: t('appointment.editTitle') }}
          />
          <Stack.Screen
            name="client/new"
            options={{ presentation: 'modal', headerShown: true, title: t('client.newTitle') }}
          />
          <Stack.Screen
            name="client/[id]"
            options={{ presentation: 'modal', headerShown: true, title: t('client.editTitle') }}
          />
        </Stack>
      </NavigationThemeProvider>
    </AppThemeProvider>
  );
}
