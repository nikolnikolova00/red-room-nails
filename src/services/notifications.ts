import { Platform } from 'react-native';

import i18n from '@/i18n';
import type { PersonalPlan } from '@/types/models';
import { combineDateAndTime, subtractMinutes } from '@/utils/date';

const REMINDER_MINUTES = 15;

export const notificationsSupported = Platform.OS !== 'web';

async function loadNotifications() {
  if (!notificationsSupported) {
    return null;
  }
  return import('expo-notifications');
}

export async function configureNotifications() {
  const Notifications = await loadNotifications();
  if (!Notifications) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('plan-reminders', {
      name: String(i18n.t('plans.channelName')),
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C98B84',
    });
  }
}

export async function requestNotificationPermission() {
  const Notifications = await loadNotifications();
  if (!Notifications) {
    return false;
  }

  const current = await Notifications.getPermissionsAsync();
  if (
    current.granted ||
    current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return (
    requested.granted ||
    requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function schedulePlanReminder(plan: PersonalPlan) {
  const Notifications = await loadNotifications();
  if (!Notifications || !plan.time || plan.done) {
    return null;
  }

  const triggerDate = subtractMinutes(combineDateAndTime(plan.date, plan.time), REMINDER_MINUTES);
  if (triggerDate.getTime() <= Date.now()) {
    return null;
  }

  const granted = await requestNotificationPermission();
  if (!granted) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: String(i18n.t('plans.reminderNotificationTitle')),
      body: String(
        i18n.t('plans.reminderNotificationBody', { title: plan.title, time: plan.time }),
      ),
      data: { url: `/plan/${plan.id}` },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: 'plan-reminders',
    },
  });
}

export async function cancelPlanReminder(notificationId: string | null) {
  if (!notificationId) {
    return;
  }

  const Notifications = await loadNotifications();
  if (!Notifications) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    return;
  }
}
