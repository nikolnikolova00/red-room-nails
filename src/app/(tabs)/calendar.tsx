import Ionicons from '@expo/vector-icons/Ionicons';
import {
  addDays,
  addMonths,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { styled } from 'styled-components/native';

import {
  AppText,
  Card,
  Chip,
  Dropdown,
  Screen,
  type DropdownOption,
} from '@/components/ui';
import { usePlansStore } from '@/store/plans';
import { theme } from '@/theme/theme';
import type { CalendarEntry } from '@/types/models';
import {
  buildMonthDays,
  formatDayNumber,
  formatLongDate,
  formatMonthYear,
  formatTime,
  formatWeekdayNarrow,
  toDateKey,
} from '@/utils/date';
import { activePlans } from '@/utils/plans';

type CalendarFilter = 'all' | 'work' | 'personal';

const APPOINTMENT_ENTRIES: CalendarEntry[] = [];

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl}px;
  gap: ${({ theme }) => theme.spacing.xl}px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const MonthHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const NavButton = styled(Pressable)`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.pill}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
`;

const Weekdays = styled.View`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Weekday = styled.View`
  flex: 1;
  align-items: center;
`;

const Week = styled.View`
  flex-direction: row;
`;

const DayCell = styled.View`
  flex: 1;
  align-items: center;
  padding-vertical: 3px;
`;

const DayButton = styled(Pressable).withConfig({
  shouldForwardProp: (prop) => !['selected', 'current', 'outside'].includes(prop),
})<{ selected: boolean; current: boolean; outside: boolean }>`
  width: 36px;
  min-height: 40px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : 'transparent'};
  border-width: ${({ current, selected }) => (current && !selected ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
  opacity: ${({ outside }) => (outside ? 0.45 : 1)};
`;

const DayNumber = styled.Text<{ selected: boolean; current: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme, selected, current }) =>
    selected
      ? theme.colors.onPrimary
      : current
        ? theme.colors.primary
        : theme.colors.text};
`;

const Dots = styled.View`
  flex-direction: row;
  gap: 2px;
  height: 4px;
`;

const Dot = styled.View.withConfig({
  shouldForwardProp: (prop) => !['kind'].includes(prop),
})<{ kind: CalendarEntry['kind'] }>`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: ${({ theme, kind }) =>
    kind === 'appointment' ? theme.colors.success : theme.colors.primary};
`;

const Section = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const EntryRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const TimeBox = styled.View`
  width: 54px;
  align-items: flex-start;
`;

const EntryInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export default function CalendarScreen() {
  const { t } = useTranslation();
  const allPlans = usePlansStore((state) => state.plans);
  const plans = useMemo(() => activePlans(allPlans), [allPlans]);

  const [filter, setFilter] = useState<CalendarFilter>('all');
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));

  const filterOptions: DropdownOption<CalendarFilter>[] = [
    { value: 'all', label: t('calendar.filterAll') },
    { value: 'work', label: t('calendar.filterWork') },
    { value: 'personal', label: t('calendar.filterPersonal') },
  ];

  const planEntries = useMemo<CalendarEntry[]>(
    () =>
      plans.map((plan) => ({
        kind: 'plan',
        id: plan.id,
        title: plan.title,
        date: plan.date,
        time: plan.time,
        done: plan.done,
        category: plan.category,
      })),
    [plans],
  );

  const entries = useMemo(() => {
    if (filter === 'personal') {
      return planEntries;
    }
    if (filter === 'work') {
      return APPOINTMENT_ENTRIES;
    }
    return [...planEntries, ...APPOINTMENT_ENTRIES];
  }, [filter, planEntries]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    entries.forEach((entry) => {
      const key = entry.kind === 'plan' ? entry.date : toDateKey(entry.startsAt);
      const current = map.get(key) ?? [];
      current.push(entry);
      map.set(key, current);
    });
    return map;
  }, [entries]);

  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);
  const weeks = useMemo(() => {
    const chunks: Date[][] = [];
    for (let index = 0; index < monthDays.length; index += 7) {
      chunks.push(monthDays.slice(index, index + 7));
    }
    return chunks;
  }, [monthDays]);

  const weekdays = Array.from({ length: 7 }, (_, index) =>
    formatWeekdayNarrow(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), index)),
  );

  const selectedKey = toDateKey(selectedDate);
  const selectedEntries = entriesByDate.get(selectedKey) ?? [];

  const goToMonth = (offset: number) => {
    const next = addMonths(visibleMonth, offset);
    setVisibleMonth(next);
    setSelectedDate(startOfMonth(next));
  };

  return (
    <Screen>
      <Content showsVerticalScrollIndicator={false}>
        <Body>
          <HeaderRow>
            <AppText variant="title">{t('tabs.calendar')}</AppText>
            <Dropdown
              value={filter}
              options={filterOptions}
              onChange={setFilter}
              accessibilityLabel={t('tabs.calendar')}
            />
          </HeaderRow>

          <Card>
            <MonthHeader>
              <NavButton
                onPress={() => goToMonth(-1)}
                accessibilityRole="button"
                accessibilityLabel={t('calendar.previousMonth')}
              >
                <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
              </NavButton>
              <AppText variant="heading">{formatMonthYear(visibleMonth)}</AppText>
              <NavButton
                onPress={() => goToMonth(1)}
                accessibilityRole="button"
                accessibilityLabel={t('calendar.nextMonth')}
              >
                <Ionicons name="chevron-forward" size={18} color={theme.colors.text} />
              </NavButton>
            </MonthHeader>

            <Weekdays>
              {weekdays.map((weekday, index) => (
                <Weekday key={`${weekday}-${index}`}>
                  <AppText variant="caption" muted>
                    {weekday}
                  </AppText>
                </Weekday>
              ))}
            </Weekdays>

            {weeks.map((week, weekIndex) => (
              <Week key={weekIndex}>
                {week.map((day) => {
                  const key = toDateKey(day);
                  const dayEntries = entriesByDate.get(key) ?? [];
                  const selected = isSameDay(day, selectedDate);
                  const current = isToday(day);
                  const outside = !isSameMonth(day, visibleMonth);

                  return (
                    <DayCell key={key}>
                      <DayButton
                        selected={selected}
                        current={current}
                        outside={outside}
                        onPress={() => setSelectedDate(startOfDay(day))}
                        accessibilityRole="button"
                        accessibilityLabel={formatLongDate(day)}
                        accessibilityState={{ selected }}
                        style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                      >
                        <DayNumber selected={selected} current={current}>
                          {formatDayNumber(day)}
                        </DayNumber>
                        <Dots>
                          {dayEntries.slice(0, 3).map((entry, index) => (
                            <Dot key={`${entry.kind}-${entry.id}-${index}`} kind={entry.kind} />
                          ))}
                        </Dots>
                      </DayButton>
                    </DayCell>
                  );
                })}
              </Week>
            ))}
          </Card>

          <Section>
            <SectionHeader>
              <AppText variant="heading">{formatLongDate(selectedDate)}</AppText>
              <AppText variant="caption" muted>
                {selectedEntries.length}
              </AppText>
            </SectionHeader>

            {selectedEntries.length === 0 ? (
              <Card>
                <AppText muted>
                  {filter === 'work' ? t('calendar.noWorkEntries') : t('calendar.noEntries')}
                </AppText>
              </Card>
            ) : (
              selectedEntries.map((entry) =>
                entry.kind === 'plan' ? (
                  <Pressable
                    key={`plan-${entry.id}`}
                    onPress={() =>
                      router.push({ pathname: '/plan/[id]', params: { id: entry.id } })
                    }
                    accessibilityRole="button"
                  >
                    <Card>
                      <EntryRow>
                        <TimeBox>
                          <AppText variant="label" muted={!entry.time}>
                            {entry.time ?? '—'}
                          </AppText>
                        </TimeBox>
                        <EntryInfo>
                          <AppText
                            variant="label"
                            style={
                              entry.done
                                ? {
                                    textDecorationLine: 'line-through',
                                    color: theme.colors.textMuted,
                                  }
                                : undefined
                            }
                          >
                            {entry.title}
                          </AppText>
                          <Chip
                            label={t(`plans.categories.${entry.category}`)}
                            tone={entry.done ? 'neutral' : 'accent'}
                          />
                        </EntryInfo>
                      </EntryRow>
                    </Card>
                  </Pressable>
                ) : (
                  <Card key={`appointment-${entry.id}`}>
                    <EntryRow>
                      <TimeBox>
                        <AppText variant="label">{formatTime(entry.startsAt)}</AppText>
                      </TimeBox>
                      <EntryInfo>
                        <AppText variant="label">{entry.title}</AppText>
                        <Chip label={t('common.work')} tone="success" />
                      </EntryInfo>
                    </EntryRow>
                  </Card>
                ),
              )
            )}
          </Section>
        </Body>
      </Content>
    </Screen>
  );
}
