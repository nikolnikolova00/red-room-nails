import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { styled } from 'styled-components/native';

import { QuickAdd } from '@/components/groceries/QuickAdd';
import { AppText, Card, Checkbox, EmptyState, Fab, Screen } from '@/components/ui';
import { useGroceriesStore } from '@/store/groceries';
import { theme } from '@/theme/theme';
import type { GroceryItem } from '@/types/models';
import { groupGroceries } from '@/utils/groceries';

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl * 2}px;
  gap: ${({ theme }) => theme.spacing.xl}px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const HeaderText = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const Section = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const SectionTitle = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const ItemInfo = styled.View`
  flex: 1;
  gap: 2px;
`;

const ClearButton = styled(Pressable)`
  align-self: flex-start;
`;

const ClearLabel = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export default function GroceriesScreen() {
  const { t } = useTranslation();
  const allItems = useGroceriesStore((state) => state.items);
  const toggleItem = useGroceriesStore((state) => state.toggleItem);
  const clearChecked = useGroceriesStore((state) => state.clearChecked);

  const { categories, bought } = useMemo(() => groupGroceries(allItems), [allItems]);
  const toBuy = categories.reduce((total, section) => total + section.data.length, 0);
  const isEmpty = categories.length === 0 && bought.length === 0;

  const renderItem = (item: GroceryItem, checked: boolean) => (
    <ItemRow key={item.id}>
      <Checkbox
        checked={checked}
        onPress={() => toggleItem(item.id)}
        accessibilityLabel={
          checked
            ? t('groceries.uncheckItem', { name: item.name })
            : t('groceries.checkItem', { name: item.name })
        }
      />
      <Pressable
        style={{ flex: 1 }}
        onPress={() =>
          router.push({ pathname: '/grocery/[id]', params: { id: item.id } })
        }
        accessibilityRole="button"
      >
        <ItemInfo>
          <AppText
            style={
              checked
                ? {
                    textDecorationLine: 'line-through',
                    color: theme.colors.textMuted,
                  }
                : undefined
            }
          >
            {item.name}
          </AppText>
          {item.quantity ? (
            <AppText variant="caption" muted>
              {item.quantity}
            </AppText>
          ) : null}
        </ItemInfo>
      </Pressable>
    </ItemRow>
  );

  return (
    <Screen>
      <Content showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Body>
          <HeaderRow>
            <HeaderText>
              <AppText variant="title">{t('groceries.title')}</AppText>
              <AppText variant="caption" muted>
                {t('groceries.itemsToBuy', { count: toBuy })}
              </AppText>
            </HeaderText>
            {bought.length > 0 ? (
              <ClearButton
                onPress={clearChecked}
                accessibilityRole="button"
                accessibilityLabel={t('groceries.clearChecked')}
              >
                <ClearLabel>{t('groceries.clearChecked')}</ClearLabel>
              </ClearButton>
            ) : null}
          </HeaderRow>

          <QuickAdd />

          {isEmpty ? (
            <EmptyState
              title={t('groceries.emptyTitle')}
              message={t('groceries.emptyMessage')}
            />
          ) : (
            <>
              {categories.length === 0 && bought.length > 0 ? (
                <Card>
                  <AppText muted>{t('groceries.allDone')}</AppText>
                </Card>
              ) : null}

              {categories.map((section) => (
                <Section key={section.category}>
                  <SectionTitle>
                    <AppText variant="heading">
                      {t(`groceries.categories.${section.category}`)}
                    </AppText>
                    <AppText variant="caption" muted>
                      {section.data.length}
                    </AppText>
                  </SectionTitle>
                  <Card>{section.data.map((item) => renderItem(item, false))}</Card>
                </Section>
              ))}

              {bought.length > 0 ? (
                <Section>
                  <SectionTitle>
                    <AppText variant="heading">{t('groceries.bought')}</AppText>
                    <AppText variant="caption" muted>
                      {bought.length}
                    </AppText>
                  </SectionTitle>
                  <Card>{bought.map((item) => renderItem(item, true))}</Card>
                </Section>
              ) : null}
            </>
          )}
        </Body>
      </Content>
      <Fab
        accessibilityLabel={t('groceries.newTitle')}
        onPress={() => router.push('/grocery/new')}
      />
    </Screen>
  );
}
