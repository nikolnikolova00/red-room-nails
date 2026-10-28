import {
  addDays,
  addMinutes,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
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

export function toDateKey(value: Date | string) {
  return format(toDate(value), 'yyyy-MM-dd');
}

export function fromDateKey(value: string) {
  return parse(value, 'yyyy-MM-dd', new Date());
}

export function toTimeKey(value: Date) {
  return format(value, 'HH:mm');
}

export function combineDateAndTime(dateKey: string, timeKey: string) {
  return parse(`${dateKey} ${timeKey}`, 'yyyy-MM-dd HH:mm', new Date());
}

export function formatMonthYear(value: Date | string) {
  return format(toDate(value), 'LLLL yyyy', { locale: activeLocale() });
}

export function formatWeekdayNarrow(value: Date | string) {
  return format(toDate(value), 'EEEEE', { locale: activeLocale() });
}

export function formatDayNumber(value: Date | string) {
  return format(toDate(value), 'd');
}

export function subtractMinutes(value: Date, minutes: number) {
  return addMinutes(value, -minutes);
}

export function buildMonthDays(month: Date) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
  const days: Date[] = [];
  let cursor = start;

  while (cursor <= end) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  return days;
}
