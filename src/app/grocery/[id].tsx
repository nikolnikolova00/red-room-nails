import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { GroceryForm } from '@/components/groceries/GroceryForm';
import { EmptyState, Screen } from '@/components/ui';
import { useGroceriesStore } from '@/store/groceries';

export default function EditGroceryScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useGroceriesStore((state) =>
    state.items.find((entry) => entry.id === id && !entry.deletedAt),
  );
  const updateItem = useGroceriesStore((state) => state.updateItem);
  const deleteItem = useGroceriesStore((state) => state.deleteItem);

  if (!item) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <EmptyState
          title={t('groceries.emptyTitle')}
          message={t('groceries.emptyMessage')}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <GroceryForm
        item={item}
        onSubmit={(input) => {
          updateItem(item.id, input);
          router.back();
        }}
        onDelete={() => {
          deleteItem(item.id);
          router.back();
        }}
      />
    </Screen>
  );
}
