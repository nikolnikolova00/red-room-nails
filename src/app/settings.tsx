import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { styled } from 'styled-components/native';

import { AppText, Card, Screen } from '@/components/ui';
import type { Language } from '@/i18n';
import { useSettingsStore } from '@/store/settings';

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const Section = styled.View`
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const Row = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Option = styled.Pressable.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})<{ active: boolean }>`
  flex: 1;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radii.pill}px;
  border-width: 1px;
  border-color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.surface)};
  align-items: center;
  justify-content: center;
`;

const OptionLabel = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme, active }) => (active ? theme.colors.onPrimary : theme.colors.text)};
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

  const activeLanguage: Language = language ?? (i18n.language === 'en' ? 'en' : 'bg');
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <Content showsVerticalScrollIndicator={false}>
        <Body>
          <Card>
            <Section>
              <AppText variant="label">{t('settings.language')}</AppText>
              <Row>
                <Option
                  active={activeLanguage === 'bg'}
                  onPress={() => setLanguage('bg')}
                  accessibilityRole="button"
                  accessibilityState={{ selected: activeLanguage === 'bg' }}
                >
                  <OptionLabel active={activeLanguage === 'bg'}>{t('settings.bulgarian')}</OptionLabel>
                </Option>
                <Option
                  active={activeLanguage === 'en'}
                  onPress={() => setLanguage('en')}
                  accessibilityRole="button"
                  accessibilityState={{ selected: activeLanguage === 'en' }}
                >
                  <OptionLabel active={activeLanguage === 'en'}>{t('settings.english')}</OptionLabel>
                </Option>
              </Row>
            </Section>
          </Card>

          <Card>
            <Section>
              <AppText variant="label">{t('settings.about')}</AppText>
              <InfoRow>
                <AppText>Red Room Nails</AppText>
                <AppText muted>
                  {t('settings.version')} {version}
                </AppText>
              </InfoRow>
            </Section>
          </Card>
        </Body>
      </Content>
    </Screen>
  );
}
