import { styled } from 'styled-components/native';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg}px;
  shadow-color: ${({ theme }) => theme.colors.text};
  shadow-opacity: 0.04;
  shadow-radius: 12px;
  shadow-offset: 0px 4px;
  elevation: 1;
`;
