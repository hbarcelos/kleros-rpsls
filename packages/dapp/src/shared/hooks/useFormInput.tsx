import { useState, useCallback, ChangeEvent, FocusEvent } from 'react';

export interface FormInputHook<T, E> {
  value: T;
  hasError: boolean;
  error: string;
  touched: boolean;
  handleChange: (evt: ChangeEvent<E>) => void;
  handleBlur: (evt: FocusEvent<E>) => void;
  triggerValidation: () => void;
}

type ValidationMode = 'onChange' | 'onBlur' | 'manual';

export interface FormInputHookParameters<T> {
  defaultValue: T;
  validate?: (value: T) => true | string;
  mode?: ValidationMode;
}

const allowAll = (): true => true;

export default function useFormInput<T, E = HTMLInputElement>({
  defaultValue,
  validate = allowAll,
  mode = 'onBlur',
}: FormInputHookParameters<T>): FormInputHook<T, E> {
  const [metadata, setMetadata] = useState({
    value: defaultValue,
    hasError: false,
    error: '',
    touched: false,
  });

  const runValidation = useCallback(
    (value: T) => {
      const validation = validate(value);
      const hasError = validation !== true;
      const error = validation !== true ? validation : '';

      return { hasError, error };
    },
    [validate]
  );

  const handleChange = useCallback(
    evt => {
      const { value } = evt.target;

      const shouldValidateOnChange = mode === 'onChange' || metadata.touched;
      const validationMixin = shouldValidateOnChange
        ? { ...runValidation(value), touched: true }
        : {};

      setMetadata(current => ({
        ...current,
        ...validationMixin,
        value,
      }));
    },
    [metadata.touched, mode, runValidation]
  );

  const handleBlur = useCallback(
    evt => {
      const { value } = evt.target;

      const shouldValidateOnBlur = mode === 'onBlur';
      const validationMixin = shouldValidateOnBlur
        ? { ...runValidation(value), touched: true }
        : {};

      setMetadata(current => ({
        ...current,
        ...validationMixin,
        value,
      }));
    },
    [mode, runValidation]
  );

  const triggerValidation = useCallback(() => {
    setMetadata(current => ({
      ...current,
      ...runValidation(current.value),
      touched: true,
    }));
  }, [runValidation]);

  return {
    ...metadata,
    handleChange,
    handleBlur,
    triggerValidation,
  };
}
