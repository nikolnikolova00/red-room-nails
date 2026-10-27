import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components/native';

import { AppText, Screen } from '@/components/ui';

const Body = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

export default function EditAppointmentScreen() {
  const { t } = useTranslation();

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Body>
        <AppText variant="heading">{t('appointment.editTitle')}</AppText>
        <AppText muted>{t('common.comingSoon')}</AppText>
      </Body>
    </Screen>
  );
}
