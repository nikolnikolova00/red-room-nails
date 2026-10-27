import { ActivityIndicator, Pressable } from 'react-native';
import { styled } from 'styled-components/native';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

const Container = styled(Pressable).withConfig({
  shouldForwardProp: (prop) => !['variant'].includes(prop),
})<{ variant: ButtonVariant; disabled: boolean }>`
  min-height: 48px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  border-radius: ${({ theme }) => theme.radii.pill}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : variant === 'secondary' ? theme.colors.surface : 'transparent'};
  border-width: ${({ variant }) => (variant === 'secondary' ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.border};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const Label = styled.Text<{ variant: ButtonVariant }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme, variant }) => (variant === 'primary' ? theme.colors.onPrimary : theme.colors.text)};
`;

export function Button({ label, onPress, variant = 'primary', disabled = false, loading = false }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Container
      variant={variant}
      disabled={isDisabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => ({ opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1 })}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : undefined} />
      ) : (
        <Label variant={variant}>{label}</Label>
      )}
    </Container>
  );
}
