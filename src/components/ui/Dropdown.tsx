import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable } from 'react-native';
import { styled } from 'styled-components/native';

import { AppText } from './AppText';

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

const Trigger = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm}px;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-radius: ${({ theme }) => theme.radii.pill}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const Root = styled.View`
  flex: 1;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const Backdrop = styled(Pressable)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

const Sheet = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.xs}px;
`;

const Option = styled(Pressable).withConfig({
  shouldForwardProp: (prop) => !['selected'].includes(prop),
})<{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.surfaceMuted : 'transparent'};
`;

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  accessibilityLabel,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <>
      <Trigger
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <AppText variant="label">{selected?.label ?? ''}</AppText>
        <Ionicons name="chevron-down" size={16} color="#8B7F7A" />
      </Trigger>
      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Root>
          <Backdrop onPress={() => setOpen(false)} />
          <Sheet>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <Option
                  key={option.value}
                  selected={isSelected}
                  onPress={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                >
                  <AppText variant={isSelected ? 'label' : 'body'}>{option.label}</AppText>
                  {isSelected ? <Ionicons name="checkmark" size={18} color="#C98B84" /> : null}
                </Option>
              );
            })}
          </Sheet>
        </Root>
      </Modal>
    </>
  );
}
