import { endOfWeek, isBefore, isToday, isTomorrow, isWithinInterval, startOfDay } from 'date-fns';

import type { PersonalPlan } from '@/types/models';
import { fromDateKey } from '@/utils/date';

export type PlanBucket = 'overdue' | 'today' | 'tomorrow' | 'week' | 'later' | 'done';

export const PLAN_BUCKET_ORDER: PlanBucket[] = [
  'overdue',
  'today',
  'tomorrow',
  'week',
  'later',
  'done',
];

export function activePlans(plans: PersonalPlan[]) {
  return plans.filter((plan) => !plan.deletedAt);
}

export function getPlanBucket(plan: PersonalPlan, now = new Date()): PlanBucket {
  if (plan.done) {
    return 'done';
  }

  const date = fromDateKey(plan.date);

  if (isBefore(date, startOfDay(now))) {
    return 'overdue';
  }
  if (isToday(date)) {
    return 'today';
  }
  if (isTomorrow(date)) {
    return 'tomorrow';
  }
  if (isWithinInterval(date, { start: startOfDay(now), end: endOfWeek(now, { weekStartsOn: 1 }) })) {
    return 'week';
  }
  return 'later';
}

export function sortPlans(plans: PersonalPlan[], now = new Date()) {
  return [...plans].sort((a, b) => {
    const bucketDiff =
      PLAN_BUCKET_ORDER.indexOf(getPlanBucket(a, now)) -
      PLAN_BUCKET_ORDER.indexOf(getPlanBucket(b, now));

    if (bucketDiff !== 0) {
      return bucketDiff;
    }

    return (
      a.date.localeCompare(b.date) ||
      (a.time ?? '99:99').localeCompare(b.time ?? '99:99') ||
      a.title.localeCompare(b.title)
    );
  });
}

export function groupPlans(plans: PersonalPlan[], now = new Date()) {
  const sorted = sortPlans(plans, now);

  return PLAN_BUCKET_ORDER.map((bucket) => ({
    bucket,
    data: sorted.filter((plan) => getPlanBucket(plan, now) === bucket),
  })).filter((section) => section.data.length > 0);
}

export function plansForDate(plans: PersonalPlan[], dateKey: string) {
  return sortPlans(plans.filter((plan) => plan.date === dateKey));
}
