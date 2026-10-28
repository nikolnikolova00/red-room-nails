import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { theme } from '@/theme/theme';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          ...(Platform.OS === 'web' ? { height: 64, paddingBottom: 8 } : null),
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.today'),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name={focused ? 'sunny' : 'sunny-outline'} size={size} color={focused ? theme.colors.primary : theme.colors.textMuted} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tabs.calendar'),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={focused ? theme.colors.primary : theme.colors.textMuted} />
          ),
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: t('tabs.plans'),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name={focused ? 'list' : 'list-outline'} size={size} color={focused ? theme.colors.primary : theme.colors.textMuted} />
          ),
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{
          title: t('tabs.groceries'),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name={focused ? 'cart' : 'cart-outline'} size={size} color={focused ? theme.colors.primary : theme.colors.textMuted} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: t('tabs.more'),
          tabBarIcon: ({ size, focused }) => (
            <Ionicons name={focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal-circle-outline'} size={size} color={focused ? theme.colors.primary : theme.colors.textMuted} />
          ),
        }}
      />
    </Tabs>
  );
}
