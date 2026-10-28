import { styled } from 'styled-components/native';

import { Chip } from './Chip';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  label?: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
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

const Options = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const ErrorText = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
`;

export function SelectField<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: SelectFieldProps<T>) {
  return (
    <Field>
      {label ? <Label>{label}</Label> : null}
      <Options>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={option.value === value}
            onPress={() => onChange(option.value)}
          />
        ))}
      </Options>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Field>
  );
}
