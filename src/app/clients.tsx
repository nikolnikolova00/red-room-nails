import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components/native';

import { EmptyState, Fab, Screen } from '@/components/ui';

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl * 2}px;
`;

export default function ClientsScreen() {
  const { t } = useTranslation();

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Content showsVerticalScrollIndicator={false}>
        <Body>
          <EmptyState title={t('clients.emptyTitle')} message={t('clients.emptyMessage')} />
        </Body>
      </Content>
      <Fab
        accessibilityLabel={t('client.newTitle')}
        onPress={() => router.push('/client/new')}
      />
    </Screen>
  );
}
