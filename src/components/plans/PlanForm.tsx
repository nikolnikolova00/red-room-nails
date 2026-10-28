import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, Pressable, Switch } from 'react-native';
import { styled } from 'styled-components/native';

import {
  AppText,
  Button,
  DateTimeField,
  Input,
  SelectField,
  type SelectOption,
} from '@/components/ui';
import type { PlanInput } from '@/store/plans';
import { theme } from '@/theme/theme';
import type { PersonalPlan, PlanCategory } from '@/types/models';
import { confirmAction } from '@/utils/confirm';
import { combineDateAndTime, fromDateKey, toDateKey, toTimeKey } from '@/utils/date';

interface PlanFormProps {
  plan?: PersonalPlan;
  onSubmit: (input: PlanInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const Content = styled.ScrollView`
  flex: 1;
`;

const Body = styled.View`
  padding: ${({ theme }) => theme.spacing.xl}px;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl}px;
  gap: ${({ theme }) => theme.spacing.lg}px;
`;

const ReminderCard = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const ReminderText = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.xs}px;
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

export function PlanForm({ plan, onSubmit, onDelete }: PlanFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(plan?.title ?? '');
  const [notes, setNotes] = useState(plan?.notes ?? '');
  const [date, setDate] = useState<Date>(() =>
    plan ? fromDateKey(plan.date) : new Date(),
  );
  const [time, setTime] = useState<Date | null>(() =>
    plan?.time ? combineDateAndTime(plan.date, plan.time) : null,
  );
  const [category, setCategory] = useState<PlanCategory>(plan?.category ?? 'personal');
  const [reminderEnabled, setReminderEnabled] = useState(plan?.reminderEnabled ?? false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const categories: SelectOption<PlanCategory>[] = [
    { value: 'personal', label: t('plans.categories.personal') },
    { value: 'errand', label: t('plans.categories.errand') },
    { value: 'health', label: t('plans.categories.health') },
    { value: 'family', label: t('plans.categories.family') },
    { value: 'other', label: t('plans.categories.other') },
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError(t('plans.titleRequired'));
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title,
        notes: notes.trim() ? notes : null,
        date: toDateKey(date),
        time: time ? toTimeKey(time) : null,
        category,
        reminderEnabled: reminderEnabled && Boolean(time),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) {
      return;
    }

    const confirmed = await confirmAction(
      t('plans.deleteTitle'),
      t('plans.deleteMessage'),
      t('common.delete'),
      t('common.cancel'),
    );

    if (confirmed) {
      await onDelete();
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
            label={t('plans.titleLabel')}
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              if (titleError) {
                setTitleError(null);
              }
            }}
            placeholder={t('plans.titlePlaceholder')}
            error={titleError}
            autoFocus={!plan}
          />
          <Input
            label={t('plans.notesLabel')}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('plans.notesPlaceholder')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{ minHeight: 100 }}
          />
          <DateTimeField
            label={t('plans.dateLabel')}
            mode="date"
            value={date}
            onChange={(value) => {
              if (value) {
                setDate(value);
              }
            }}
          />
          <DateTimeField
            label={`${t('plans.timeLabel')} (${t('common.optional')})`}
            mode="time"
            value={time}
            onChange={(value) => {
              setTime(value);
              if (!value) {
                setReminderEnabled(false);
              }
            }}
            placeholder={t('common.notSet')}
            clearable
          />
          <SelectField
            label={t('plans.categoryLabel')}
            options={categories}
            value={category}
            onChange={setCategory}
          />
          <ReminderCard>
            <ReminderText>
              <AppText variant="label">{t('plans.reminderLabel')}</AppText>
              <AppText variant="caption" muted>
                {time ? t('plans.reminderCaption') : t('plans.reminderNeedsTime')}
              </AppText>
            </ReminderText>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              disabled={!time}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.surface}
              accessibilityLabel={t('plans.reminderLabel')}
            />
          </ReminderCard>
          <Button label={t('common.save')} onPress={() => void handleSave()} loading={saving} />
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
