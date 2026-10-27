import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components/native';

import { AppText, EmptyState, Fab, Screen } from '@/components/ui';
import { formatLongDate } from '@/utils/date';

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl * 2}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export default function TodayScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Content showsVerticalScrollIndicator={false}>
        <Body>
          <AppText variant="caption" muted>
            {formatLongDate(new Date())}
          </AppText>
          <AppText variant="title">{t('tabs.today')}</AppText>
          <EmptyState title={t('today.emptyTitle')} message={t('today.emptyMessage')} />
        </Body>
      </Content>
      <Fab
        accessibilityLabel={t('today.newAppointment')}
        onPress={() => router.push('/appointment/new')}
      />
    </Screen>
  );
}
