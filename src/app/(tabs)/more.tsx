import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import { styled } from 'styled-components/native';

import { AppText, Card, Screen } from '@/components/ui';
import { theme } from '@/theme/theme';

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  padding-top: ${({ theme }) => theme.spacing.lg}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl}px;
  gap: ${({ theme }) => theme.spacing.xl}px;
`;

const Section = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const MenuRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const IconWrap = styled.View`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
`;

const TextWrap = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

export default function MoreScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <Content showsVerticalScrollIndicator={false}>
        <Body>
          <AppText variant="title">{t('more.title')}</AppText>

          <Section>
            <AppText variant="label" muted>
              {t('more.manage')}
            </AppText>
            <Pressable
              onPress={() => router.push('/clients')}
              accessibilityRole="button"
              accessibilityLabel={t('more.clients')}
            >
              <Card>
                <MenuRow>
                  <IconWrap>
                    <Ionicons name="people-outline" size={22} color={theme.colors.primary} />
                  </IconWrap>
                  <TextWrap>
                    <AppText variant="label">{t('more.clients')}</AppText>
                    <AppText variant="caption" muted>
                      {t('more.clientsDescription')}
                    </AppText>
                  </TextWrap>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                </MenuRow>
              </Card>
            </Pressable>

            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel={t('more.settings')}
            >
              <Card>
                <MenuRow>
                  <IconWrap>
                    <Ionicons name="settings-outline" size={22} color={theme.colors.primary} />
                  </IconWrap>
                  <TextWrap>
                    <AppText variant="label">{t('more.settings')}</AppText>
                    <AppText variant="caption" muted>
                      {t('more.settingsDescription')}
                    </AppText>
                  </TextWrap>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                </MenuRow>
              </Card>
            </Pressable>
          </Section>
        </Body>
      </Content>
    </Screen>
  );
}
