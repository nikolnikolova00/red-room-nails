import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, View } from 'react-native';
import { styled } from 'styled-components/native';

import { theme } from '@/theme/theme';
import {
  combineDateAndTime,
  formatLongDate,
  formatTime,
  fromDateKey,
  toDateKey,
  toTimeKey,
} from '@/utils/date';

import { AppText } from './AppText';
import { Button } from './Button';
import { Input } from './Input';

interface DateTimeFieldProps {
  label: string;
  mode: 'date' | 'time';
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
  clearable?: boolean;
  error?: string | null;
}

const Field = styled.View`
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Row = styled.View.withConfig({
  shouldForwardProp: (prop) => !['hasError'].includes(prop),
})<{ hasError: boolean }>`
  min-height: 48px;
  flex-direction: row;
  align-items: center;
  border-radius: ${({ theme }) => theme.radii.md}px;
  border-width: 1px;
  border-color: ${({ theme, hasError }) =>
    hasError ? theme.colors.danger : theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

const ValueButton = styled(Pressable)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const ClearButton = styled(Pressable)`
  padding-left: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
`;

const ModalRoot = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const ModalBackdrop = styled(Pressable)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

const ModalSheet = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

const Actions = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

function WebDateTimeField({
  label,
  mode,
  value,
  onChange,
  placeholder,
  error,
}: DateTimeFieldProps) {
  const [text, setText] = useState(() => {
    if (!value) {
      return '';
    }
    return mode === 'date' ? toDateKey(value) : toTimeKey(value);
  });

  const handleChange = (next: string) => {
    setText(next);
    const trimmed = next.trim();

    if (!trimmed) {
      onChange(null);
      return;
    }

    if (mode === 'date') {
      const parsed = fromDateKey(trimmed);
      onChange(Number.isNaN(parsed.getTime()) ? null : parsed);
      return;
    }

    const parsed = combineDateAndTime(toDateKey(new Date()), trimmed);
    onChange(Number.isNaN(parsed.getTime()) ? null : parsed);
  };

  return (
    <Input
      label={label}
      value={text}
      onChangeText={handleChange}
      placeholder={placeholder}
      error={error}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

export function DateTimeField(props: DateTimeFieldProps) {
  const { label, mode, value, onChange, placeholder, clearable, error } = props;
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(value ?? new Date());

  if (Platform.OS === 'web') {
    return <WebDateTimeField {...props} />;
  }

  const openPicker = () => {
    setDraft(value ?? new Date());
    setShow(true);
  };

  const handleNativeChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selected) {
        onChange(selected);
      }
      return;
    }

    if (selected) {
      setDraft(selected);
    }
  };

  const displayValue = value
    ? mode === 'date'
      ? formatLongDate(value)
      : formatTime(value)
    : (placeholder ?? t('common.notSet'));

  return (
    <Field>
      <Label>{label}</Label>
      <Row hasError={Boolean(error)}>
        <ValueButton
          onPress={openPicker}
          accessibilityRole="button"
          accessibilityLabel={label}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <AppText muted={!value}>{displayValue}</AppText>
          <Ionicons
            name={mode === 'date' ? 'calendar-outline' : 'time-outline'}
            size={18}
            color={theme.colors.textMuted}
          />
        </ValueButton>
        {clearable && value ? (
          <ClearButton
            onPress={() => onChange(null)}
            accessibilityRole="button"
            accessibilityLabel={t('common.clear')}
          >
            <Ionicons name="close-circle" size={18} color={theme.colors.textMuted} />
          </ClearButton>
        ) : null}
      </Row>
      {error ? <ErrorText>{error}</ErrorText> : null}

      {Platform.OS === 'android' && show ? (
        <DateTimePicker
          value={draft}
          mode={mode}
          display="default"
          onChange={handleNativeChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          transparent
          visible={show}
          animationType="fade"
          onRequestClose={() => setShow(false)}
        >
          <ModalRoot>
            <ModalBackdrop onPress={() => setShow(false)} />
            <ModalSheet>
              <AppText variant="heading">{label}</AppText>
              <DateTimePicker
                value={draft}
                mode={mode}
                display="spinner"
                themeVariant="light"
                onChange={handleNativeChange}
              />
              <Actions>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t('common.cancel')}
                    variant="ghost"
                    onPress={() => setShow(false)}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label={t('common.done')}
                    onPress={() => {
                      onChange(draft);
                      setShow(false);
                    }}
                  />
                </View>
              </Actions>
            </ModalSheet>
          </ModalRoot>
        </Modal>
      ) : null}
    </Field>
  );
}
