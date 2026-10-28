import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';
import { styled } from 'styled-components/native';

import { theme } from '@/theme/theme';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}

const Box = styled(Pressable).withConfig({
  shouldForwardProp: (prop) => !['checked'].includes(prop),
})<{ checked: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: ${({ theme }) => theme.radii.sm}px;
  border-width: 1.5px;
  align-items: center;
  justify-content: center;
  border-color: ${({ theme, checked }) => (checked ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, checked }) => (checked ? theme.colors.primary : 'transparent')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export function Checkbox({ checked, onPress, accessibilityLabel, disabled = false }: CheckboxProps) {
  return (
    <Box
      checked={checked}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({ opacity: disabled ? 0.5 : pressed ? 0.75 : 1 })}
    >
      {checked ? <Ionicons name="checkmark" size={18} color={theme.colors.onPrimary} /> : null}
    </Box>
  );
}
