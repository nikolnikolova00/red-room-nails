import { Pressable } from 'react-native';
import { styled } from 'styled-components/native';

export type ChipTone = 'neutral' | 'primary' | 'accent' | 'success' | 'danger';

interface ChipProps {
  label: string;
  tone?: ChipTone;
  selected?: boolean;
  onPress?: () => void;
}

const Container = styled(Pressable).withConfig({
  shouldForwardProp: (prop) => !['tone', 'selected'].includes(prop),
})<{ tone: ChipTone; selected: boolean }>`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: 5px;
  border-radius: ${({ theme }) => theme.radii.pill}px;
  background-color: ${({ theme, tone, selected }) => {
    if (selected) {
      return theme.colors.primary;
    }
    if (tone === 'primary') {
      return theme.colors.primary;
    }
    if (tone === 'accent') {
      return theme.colors.surfaceMuted;
    }
    if (tone === 'success') {
      return '#E7EFE8';
    }
    if (tone === 'danger') {
      return '#F7E7E5';
    }
    return theme.colors.surfaceMuted;
  }};
`;

const Label = styled.Text.withConfig({
  shouldForwardProp: (prop) => !['tone', 'selected'].includes(prop),
})<{ tone: ChipTone; selected: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme, tone, selected }) => {
    if (selected || tone === 'primary') {
      return theme.colors.onPrimary;
    }
    if (tone === 'success') {
      return theme.colors.success;
    }
    if (tone === 'danger') {
      return theme.colors.danger;
    }
    if (tone === 'accent') {
      return theme.colors.primaryPressed;
    }
    return theme.colors.textMuted;
  }};
`;

export function Chip({ label, tone = 'neutral', selected = false, onPress }: ChipProps) {
  return (
    <Container
      tone={tone}
      selected={selected}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={onPress ? { selected } : undefined}
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
    >
      <Label tone={tone} selected={selected}>
        {label}
      </Label>
    </Container>
  );
}
