import type { PropsWithChildren } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'styled-components/native';

const Root = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

interface ScreenProps extends PropsWithChildren {
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function Screen({ children, edges = ['top', 'left', 'right'] }: ScreenProps) {
  return (
    <Root edges={edges} collapsable={false}>
      {children}
    </Root>
  );
}
