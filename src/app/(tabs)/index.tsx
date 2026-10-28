import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { styled } from 'styled-components/native';

import { AppText, Card, Checkbox, Chip, Fab, Screen } from '@/components/ui';
import { useGroceriesStore } from '@/store/groceries';
import { usePlansStore } from '@/store/plans';
import { formatLongDate, toDateKey } from '@/utils/date';
import { activeGroceries } from '@/utils/groceries';
import { activePlans, sortPlans } from '@/utils/plans';

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

const SectionHeader = styled.View`
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

const GroceryRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const GroceryList = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ViewAll = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs}px;
  margin-top: ${({ theme }) => theme.spacing.md}px;
`;

const ViewAllLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardBody = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

export default function TodayScreen() {
  const { t } = useTranslation();
  const allPlans = usePlansStore((state) => state.plans);
  const togglePlan = usePlansStore((state) => state.togglePlan);
  const allGroceries = useGroceriesStore((state) => state.items);
  const toggleItem = useGroceriesStore((state) => state.toggleItem);

  const todayKey = toDateKey(new Date());
  const todayPlans = useMemo(
    () =>
      sortPlans(
        activePlans(allPlans).filter((plan) => plan.date === todayKey && !plan.done),
      ),
    [allPlans, todayKey],
  );
  const groceries = useMemo(() => activeGroceries(allGroceries), [allGroceries]);
  const toBuy = useMemo(() => groceries.filter((item) => !item.checked), [groceries]);
  const preview = toBuy.slice(0, 3);

  return (
    <Screen>
      <Content showsVerticalScrollIndicator={false}>
        <Body>
          <AppText variant="caption" muted>
            {formatLongDate(new Date())}
          </AppText>
          <AppText variant="title">{t('tabs.today')}</AppText>

          <Section>
            <SectionHeader>
              <AppText variant="heading">{t('today.plans')}</AppText>
            </SectionHeader>
            <Card>
              {todayPlans.length === 0 ? (
                <AppText muted>{t('today.noPlans')}</AppText>
              ) : (
                todayPlans.map((plan) => (
                  <PlanRow key={plan.id}>
                    <Checkbox
                      checked={false}
                      onPress={() => void togglePlan(plan.id)}
                      accessibilityLabel={t('plans.markDone')}
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
                            <AppText variant="label">{plan.title}</AppText>
                          </PlanTitle>
                          {plan.time ? (
                            <AppText variant="caption" muted>
                              {plan.time}
                            </AppText>
                          ) : null}
                        </TitleRow>
                        <Chip
                          label={t(`plans.categories.${plan.category}`)}
                          tone="accent"
                        />
                      </PlanInfo>
                    </Pressable>
                  </PlanRow>
                ))
              )}
            </Card>
          </Section>

          <Section>
            <SectionHeader>
              <AppText variant="heading">{t('today.groceries')}</AppText>
            </SectionHeader>
            <Card>
              <CardBody>
                {toBuy.length === 0 ? (
                  <AppText muted>{t('today.groceryEmpty')}</AppText>
                ) : (
                  <>
                    <AppText variant="label">
                      {t('today.grocerySummary', { count: toBuy.length })}
                    </AppText>
                    <GroceryList>
                      {preview.map((item) => (
                        <GroceryRow key={item.id}>
                          <Checkbox
                            checked={false}
                            onPress={() => toggleItem(item.id)}
                            accessibilityLabel={t('groceries.checkItem', {
                              name: item.name,
                            })}
                          />
                          <AppText>
                            {item.name}
                            {item.quantity ? ` · ${item.quantity}` : ''}
                          </AppText>
                        </GroceryRow>
                      ))}
                    </GroceryList>
                    {toBuy.length > preview.length ? (
                      <AppText variant="caption" muted>
                        +{toBuy.length - preview.length}
                      </AppText>
                    ) : null}
                  </>
                )}
                <ViewAll
                  onPress={() => router.push('/groceries')}
                  accessibilityRole="button"
                  accessibilityLabel={t('today.viewGroceries')}
                >
                  <ViewAllLabel>{t('today.viewGroceries')}</ViewAllLabel>
                  <Ionicons name="arrow-forward" size={16} color="#C98B84" />
                </ViewAll>
              </CardBody>
            </Card>
          </Section>

          <Section>
            <SectionHeader>
              <AppText variant="heading">{t('today.appointments')}</AppText>
            </SectionHeader>
            <Card>
              <AppText muted>{t('today.appointmentsComingSoon')}</AppText>
            </Card>
          </Section>
        </Body>
      </Content>
      <Fab
        accessibilityLabel={t('today.newPlan')}
        onPress={() => router.push('/plan/new')}
      />
    </Screen>
  );
}
