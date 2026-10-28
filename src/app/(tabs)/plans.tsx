import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { styled } from 'styled-components/native';

import { AppText, Card, Checkbox, Chip, EmptyState, Fab, Screen } from '@/components/ui';
import { usePlansStore } from '@/store/plans';
import { theme } from '@/theme/theme';
import { formatShortDate, fromDateKey } from '@/utils/date';
import { activePlans, groupPlans } from '@/utils/plans';

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl * 2}px;
  gap: ${({ theme }) => theme.spacing.xl}px;
`;

const Section = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const SectionTitle = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const PlanRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const PlanInfo = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const PlanTitle = styled.View`
  flex: 1;
`;

const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export default function PlansScreen() {
  const { t } = useTranslation();
  const allPlans = usePlansStore((state) => state.plans);
  const togglePlan = usePlansStore((state) => state.togglePlan);

  const sections = useMemo(() => groupPlans(activePlans(allPlans)), [allPlans]);
  const hasPlans = sections.length > 0;

  return (
    <Screen>
      <Content showsVerticalScrollIndicator={false}>
        <Body>
          <AppText variant="title">{t('plans.title')}</AppText>

          {!hasPlans ? (
            <EmptyState title={t('plans.emptyTitle')} message={t('plans.emptyMessage')} />
          ) : (
            sections.map((section) => (
              <Section key={section.bucket}>
                <SectionTitle>
                  <AppText variant="heading">
                    {t(`plans.sections.${section.bucket}`)}
                  </AppText>
                  <AppText variant="caption" muted>
                    {section.data.length}
                  </AppText>
                </SectionTitle>
                <Card>
                  {section.data.map((plan) => (
                    <PlanRow key={plan.id}>
                      <Checkbox
                        checked={plan.done}
                        onPress={() => void togglePlan(plan.id)}
                        accessibilityLabel={
                          plan.done ? t('plans.markNotDone') : t('plans.markDone')
                        }
                      />
                      <Pressable
                        style={{ flex: 1 }}
                        onPress={() =>
                          router.push({ pathname: '/plan/[id]', params: { id: plan.id } })
                        }
                        accessibilityRole="button"
                      >
                        <PlanInfo>
                          <TitleRow>
                            <PlanTitle>
                              <AppText
                                variant="label"
                                style={
                                  plan.done
                                    ? {
                                        textDecorationLine: 'line-through',
                                        color: theme.colors.textMuted,
                                      }
                                    : undefined
                                }
                              >
                                {plan.title}
                              </AppText>
                            </PlanTitle>
                            {plan.reminderEnabled && plan.time ? (
                              <Ionicons
                                name="notifications-outline"
                                size={14}
                                color={theme.colors.textMuted}
                              />
                            ) : null}
                          </TitleRow>
                          <MetaRow>
                            <AppText variant="caption" muted>
                              {formatShortDate(fromDateKey(plan.date))}
                              {plan.time ? ` · ${plan.time}` : ''}
                            </AppText>
                            <Chip
                              label={t(`plans.categories.${plan.category}`)}
                              tone={plan.done ? 'neutral' : 'accent'}
                            />
                          </MetaRow>
                        </PlanInfo>
                      </Pressable>
                    </PlanRow>
                  ))}
                </Card>
              </Section>
            ))
          )}
        </Body>
      </Content>
      <Fab
        accessibilityLabel={t('plans.newTitle')}
        onPress={() => router.push('/plan/new')}
      />
    </Screen>
  );
}
