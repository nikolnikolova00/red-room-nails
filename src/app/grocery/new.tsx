import { router } from 'expo-router';

import { GroceryForm } from '@/components/groceries/GroceryForm';
import { Screen } from '@/components/ui';
import { useGroceriesStore } from '@/store/groceries';

export default function NewGroceryScreen() {
  const addItem = useGroceriesStore((state) => state.addItem);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <GroceryForm
        onSubmit={(input) => {
          addItem(input);
          router.back();
        }}
      />
    </Screen>
  );
}
