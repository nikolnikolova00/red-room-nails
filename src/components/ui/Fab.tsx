import { Pressable } from 'react-native';
import { styled } from 'styled-components/native';

interface FabProps {
  onPress: () => void;
  accessibilityLabel: string;
}

const Container = styled(Pressable)`
  position: absolute;
  right: ${({ theme }) => theme.spacing.xl}px;
  bottom: ${({ theme }) => theme.spacing.xl}px;
  width: 58px;
  height: 58px;
  border-radius: 29px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  shadow-color: ${({ theme }) => theme.colors.text};
  shadow-opacity: 0.18;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
  elevation: 4;
`;

const Plus = styled.Text`
  font-size: 32px;
  line-height: 34px;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.onPrimary};
`;

export function Fab({ onPress, accessibilityLabel }: FabProps) {
  return (
    <Container
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Plus>+</Plus>
    </Container>
  );
}
