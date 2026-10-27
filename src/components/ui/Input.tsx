import { useState } from 'react';
import type { TextInputProps } from 'react-native';
import { styled } from 'styled-components/native';

interface InputProps extends TextInputProps {
  label?: string;
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

const FieldInput = styled.TextInput.withConfig({
  shouldForwardProp: (prop) => !['focused', 'hasError'].includes(prop),
})<{ focused: boolean; hasError: boolean }>`
  min-height: 48px;
  border-radius: ${({ theme }) => theme.radii.md}px;
  border-width: 1px;
  border-color: ${({ theme, focused, hasError }) =>
    hasError ? theme.colors.danger : focused ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
`;

export function Input({ label, error, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Field>
      {label ? <Label>{label}</Label> : null}
      <FieldInput
        {...props}
        focused={focused}
        hasError={Boolean(error)}
        placeholderTextColor={props.placeholderTextColor ?? '#8B7F7A'}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Field>
  );
}
