import { format, parseISO } from 'date-fns';
import { bg, enUS } from 'date-fns/locale';

import i18n from '@/i18n';

function activeLocale() {
  return i18n.language === 'en' ? enUS : bg;
}

function toDate(value: Date | string) {
  return typeof value === 'string' ? parseISO(value) : value;
}

export function formatLongDate(value: Date | string) {
  return format(toDate(value), 'EEEE, d MMMM', { locale: activeLocale() });
}

export function formatShortDate(value: Date | string) {
  return format(toDate(value), 'd MMM', { locale: activeLocale() });
}

export function formatTime(value: Date | string) {
  return format(toDate(value), 'HH:mm');
}

export function toIso(value: Date) {
  return value.toISOString();
}
