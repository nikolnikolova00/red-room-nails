import { router, type Href } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import type * as Notifications from 'expo-notifications';

export function useNotificationObserver() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    let subscription: { remove: () => void } | undefined;
    let active = true;

    void (async () => {
      const NotificationsModule = await import('expo-notifications');
      if (!active) {
        return;
      }

      const redirect = (notification: Notifications.Notification) => {
        const url = notification.request.content.data?.url;
        if (typeof url === 'string') {
          router.push(url as Href);
          NotificationsModule.clearLastNotificationResponse();
        }
      };

      const response = NotificationsModule.getLastNotificationResponse();
      if (response?.notification) {
        redirect(response.notification);
      }

      subscription = NotificationsModule.addNotificationResponseReceivedListener((event) => {
        redirect(event.notification);
      });
    })();

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);
}
