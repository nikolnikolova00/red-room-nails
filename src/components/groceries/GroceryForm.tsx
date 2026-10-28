import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { styled } from 'styled-components/native';

import { Button, Input, SelectField, type SelectOption } from '@/components/ui';
import type { GroceryInput } from '@/store/groceries';
import type { GroceryCategory, GroceryItem } from '@/types/models';
import { confirmAction } from '@/utils/confirm';

interface GroceryFormProps {
  item?: GroceryItem;
  onSubmit: (input: GroceryInput) => void;
  onDelete?: () => void;
}

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const DeleteLink = styled(Pressable)`
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
`;

const DeleteLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.danger};
`;

export function GroceryForm({ item, onSubmit, onDelete }: GroceryFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(item?.name ?? '');
  const [quantity, setQuantity] = useState(item?.quantity ?? '');
  const [category, setCategory] = useState<GroceryCategory>(item?.category ?? 'produce');
  const [nameError, setNameError] = useState<string | null>(null);

  const categories: SelectOption<GroceryCategory>[] = [
    { value: 'produce', label: t('groceries.categories.produce') },
    { value: 'dairy', label: t('groceries.categories.dairy') },
    { value: 'meat', label: t('groceries.categories.meat') },
    { value: 'bakery', label: t('groceries.categories.bakery') },
    { value: 'pantry', label: t('groceries.categories.pantry') },
    { value: 'frozen', label: t('groceries.categories.frozen') },
    { value: 'household', label: t('groceries.categories.household') },
    { value: 'other', label: t('groceries.categories.other') },
  ];

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(t('groceries.nameRequired'));
      return;
    }

    onSubmit({
      name,
      quantity: quantity.trim() ? quantity : null,
      category,
    });
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const confirmed = await confirmAction(
      t('groceries.deleteTitle'),
      t('groceries.deleteMessage'),
      t('common.delete'),
      t('common.cancel'),
    );

    if (confirmed) {
      onDelete();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <Content
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Body>
          <Input
            label={t('groceries.nameLabel')}
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (nameError) {
                setNameError(null);
              }
            }}
            placeholder={t('groceries.namePlaceholder')}
            error={nameError}
            autoFocus={!item}
          />
          <Input
            label={`${t('groceries.quantityLabel')} (${t('common.optional')})`}
            value={quantity}
            onChangeText={setQuantity}
            placeholder={t('groceries.quantityPlaceholder')}
          />
          <SelectField
            label={t('groceries.categoryLabel')}
            options={categories}
            value={category}
            onChange={setCategory}
          />
          <Button label={t('common.save')} onPress={handleSave} />
          {onDelete ? (
            <DeleteLink
              onPress={() => void handleDelete()}
              accessibilityRole="button"
              accessibilityLabel={t('common.delete')}
            >
              <DeleteLabel>{t('common.delete')}</DeleteLabel>
            </DeleteLink>
          ) : null}
        </Body>
      </Content>
    </KeyboardAvoidingView>
  );
}
