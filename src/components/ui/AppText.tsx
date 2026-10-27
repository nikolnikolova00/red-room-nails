import type { TextProps } from 'react-native';
import { styled } from 'styled-components/native';

export type TextVariant = 'title' | 'heading' | 'body' | 'label' | 'caption';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  muted?: boolean;
  center?: boolean;
}

export const AppText = styled.Text.withConfig({
  shouldForwardProp: (prop) => !['variant', 'muted', 'center'].includes(prop),
})<AppTextProps>`
  ${({ theme, variant = 'body' }) => {
    const style = theme.typography[variant];
    return `font-size: ${style.fontSize}px; line-height: ${style.lineHeight}px; font-weight: ${style.fontWeight};`;
  }}
  color: ${({ theme, muted }) => (muted ? theme.colors.textMuted : theme.colors.text)};
  ${({ center }) => (center ? 'text-align: center;' : '')}
`;
