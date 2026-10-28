import { router } from 'expo-router';

import { PlanForm } from '@/components/plans/PlanForm';
import { Screen } from '@/components/ui';
import { usePlansStore } from '@/store/plans';

export default function NewPlanScreen() {
  const addPlan = usePlansStore((state) => state.addPlan);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <PlanForm
        onSubmit={async (input) => {
          await addPlan(input);
          router.back();
        }}
      />
    </Screen>
  );
}
