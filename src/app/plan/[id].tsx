import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { PlanForm } from '@/components/plans/PlanForm';
import { EmptyState, Screen } from '@/components/ui';
import { usePlansStore } from '@/store/plans';

export default function EditPlanScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlansStore((state) =>
    state.plans.find((item) => item.id === id && !item.deletedAt),
  );
  const updatePlan = usePlansStore((state) => state.updatePlan);
  const deletePlan = usePlansStore((state) => state.deletePlan);

  if (!plan) {
    return (
      <Screen edges={['left', 'right', 'bottom']}>
        <EmptyState title={t('plans.emptyTitle')} message={t('plans.emptyMessage')} />
      </Screen>
    );
  }

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <PlanForm
        plan={plan}
        onSubmit={async (input) => {
          await updatePlan(plan.id, input);
          router.back();
        }}
        onDelete={async () => {
          await deletePlan(plan.id);
          router.back();
        }}
      />
    </Screen>
  );
}
