import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, type TextInputInstance } from 'react-native';
import { styled } from 'styled-components/native';

import { Card, Chip } from '@/components/ui';
import { useGroceriesStore } from '@/store/groceries';
import { theme } from '@/theme/theme';
import type { GroceryCategory } from '@/types/models';
import { GROCERY_CATEGORY_ORDER } from '@/utils/groceries';

const Body = styled.View`
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Field = styled.TextInput`
  flex: 1;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const AddButton = styled(Pressable)`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.pill}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const Caption = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Chips = styled(ScrollView)`
  flex-grow: 0;
`;

export function QuickAdd() {
  const { t } = useTranslation();
  const addItem = useGroceriesStore((state) => state.addItem);
  const [value, setValue] = useState('');
  const [category, setCategory] = useState<GroceryCategory>('produce');
  const inputRef = useRef<TextInputInstance>(null);

  const handleAdd = () => {
    const names = value
      .split(/[,\n;]+/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (names.length === 0) {
      return;
    }

    names.forEach((name) => addItem({ name, quantity: null, category }));
    setValue('');
    inputRef.current?.focus();
  };

  return (
    <Card>
      <Body>
        <Row>
          <Field
            ref={inputRef}
            value={value}
            onChangeText={setValue}
            placeholder={t('groceries.quickAddPlaceholder')}
            placeholderTextColor={theme.colors.textMuted}
            returnKeyType="done"
            submitBehavior="submit"
            onSubmitEditing={handleAdd}
            accessibilityLabel={t('groceries.quickAddPlaceholder')}
            autoCorrect={false}
          />
          <AddButton
            onPress={handleAdd}
            disabled={!value.trim()}
            accessibilityRole="button"
            accessibilityLabel={t('groceries.quickAddButton')}
            accessibilityState={{ disabled: !value.trim() }}
            style={({ pressed }) => ({
              opacity: !value.trim() ? 0.5 : pressed ? 0.85 : 1,
            })}
          >
            <Ionicons name="add" size={26} color={theme.colors.onPrimary} />
          </AddButton>
        </Row>
        <Caption>{t('groceries.quickAddHint')}</Caption>
        <Chips
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: theme.spacing.sm }}
        >
          {GROCERY_CATEGORY_ORDER.map((option) => (
            <Chip
              key={option}
              label={t(`groceries.categories.${option}`)}
              selected={option === category}
              onPress={() => setCategory(option)}
            />
          ))}
        </Chips>
      </Body>
    </Card>
  );
}
