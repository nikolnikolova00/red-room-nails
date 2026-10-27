import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components/native';

import { AppText, Button, Screen } from '@/components/ui';

const Body = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <Screen edges={['top', 'bottom', 'left', 'right']}>
      <Body>
        <AppText variant="heading" center>
          {t('notFound.title')}
        </AppText>
        <AppText muted center>
          {t('notFound.message')}
        </AppText>
        <Button label={t('notFound.goHome')} onPress={() => router.replace('/')} />
      </Body>
    </Screen>
  );
}
