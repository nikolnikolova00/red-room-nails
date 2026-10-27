import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components/native';

import { AppText, EmptyState, Screen } from '@/components/ui';

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export default function CalendarScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Content showsVerticalScrollIndicator={false}>
        <Body>
          <AppText variant="title">{t('tabs.calendar')}</AppText>
          <EmptyState title={t('calendar.emptyTitle')} message={t('calendar.emptyMessage')} />
        </Body>
      </Content>
    </Screen>
  );
}
