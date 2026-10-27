import { styled } from 'styled-components/native';

import { AppText } from './AppText';

interface EmptyStateProps {
  title: string;
  message?: string;
}

const Container = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: ${({ theme }) => theme.spacing.xxl}px;
  padding-horizontal: ${({ theme }) => theme.spacing.xl}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const Accent = styled.View`
  width: 40px;
  height: 3px;
  border-radius: 2px;
  background-color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <Container>
      <Accent />
      <AppText variant="heading" center>
        {title}
      </AppText>
      {message ? (
        <AppText muted center>
          {message}
        </AppText>
      ) : null}
    </Container>
  );
}
