import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { cancelPlanReminder, schedulePlanReminder } from '@/services/notifications';
import type { PersonalPlan, PlanCategory } from '@/types/models';
import { createId } from '@/utils/id';

export interface PlanInput {
  title: string;
  notes: string | null;
  date: string;
  time: string | null;
  category: PlanCategory;
  reminderEnabled: boolean;
}

interface PlansState {
  plans: PersonalPlan[];
  addPlan: (input: PlanInput) => Promise<PersonalPlan>;
  updatePlan: (id: string, input: PlanInput) => Promise<void>;
  togglePlan: (id: string) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}

function normalizeNotes(notes: string | null) {
  const trimmed = notes?.trim();
  return trimmed ? trimmed : null;
}

export const usePlansStore = create<PlansState>()(
  persist(
    (set, get) => ({
      plans: [],
      addPlan: async (input) => {
        const now = new Date().toISOString();
        const plan: PersonalPlan = {
          id: createId(),
          title: input.title.trim(),
          notes: normalizeNotes(input.notes),
          date: input.date,
          time: input.time,
          category: input.category,
          done: false,
          reminderEnabled: input.reminderEnabled,
          notificationId: null,
          createdAt: now,
          updatedAt: now,
          deletedAt: null,
        };

        set((state) => ({ plans: [plan, ...state.plans] }));

        if (plan.reminderEnabled && plan.time) {
          const notificationId = await schedulePlanReminder(plan).catch(() => null);
          if (notificationId) {
            set((state) => ({
              plans: state.plans.map((item) =>
                item.id === plan.id ? { ...item, notificationId } : item,
              ),
            }));
          }
        }

        return plan;
      },
      updatePlan: async (id, input) => {
        const existing = get().plans.find((plan) => plan.id === id);
        if (!existing || existing.deletedAt) {
          return;
        }

        await cancelPlanReminder(existing.notificationId);

        const updated: PersonalPlan = {
          ...existing,
          title: input.title.trim(),
          notes: normalizeNotes(input.notes),
          date: input.date,
          time: input.time,
          category: input.category,
          reminderEnabled: input.reminderEnabled,
          notificationId: null,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          plans: state.plans.map((plan) => (plan.id === id ? updated : plan)),
        }));

        if (!updated.done && updated.reminderEnabled && updated.time) {
          const notificationId = await schedulePlanReminder(updated).catch(() => null);
          if (notificationId) {
            set((state) => ({
              plans: state.plans.map((plan) =>
                plan.id === id ? { ...plan, notificationId } : plan,
              ),
            }));
          }
        }
      },
      togglePlan: async (id) => {
        const existing = get().plans.find((plan) => plan.id === id);
        if (!existing || existing.deletedAt) {
          return;
        }

        const done = !existing.done;
        if (done) {
          await cancelPlanReminder(existing.notificationId);
        }

        const updated: PersonalPlan = {
          ...existing,
          done,
          notificationId: done ? null : existing.notificationId,
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          plans: state.plans.map((plan) => (plan.id === id ? updated : plan)),
        }));

        if (!done && updated.reminderEnabled && updated.time) {
          const notificationId = await schedulePlanReminder(updated).catch(() => null);
          if (notificationId) {
            set((state) => ({
              plans: state.plans.map((plan) =>
                plan.id === id ? { ...plan, notificationId } : plan,
              ),
            }));
          }
        }
      },
      deletePlan: async (id) => {
        const existing = get().plans.find((plan) => plan.id === id);
        if (!existing || existing.deletedAt) {
          return;
        }

        await cancelPlanReminder(existing.notificationId);

        const now = new Date().toISOString();
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.id === id
              ? { ...plan, deletedAt: now, notificationId: null, updatedAt: now }
              : plan,
          ),
        }));
      },
    }),
    {
      name: 'rnn-plans',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
