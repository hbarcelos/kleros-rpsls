import { useCallback, useState, useEffect, FormEvent } from 'react';
import { FormInputHook } from './useFormInput';

interface UseFormHook {
  handleSubmit: (evt: FormEvent) => void;
  inputs: Record<string, FormInputHook<any, any>>;
  isValid: boolean;
  canSubmit: boolean;
}

interface UseFormHookParameters {
  inputs: Record<string, FormInputHook<any, any>>;
  onSubmit: (data: Record<string, unknown>) => void;
}

export default function useForm({
  inputs,
  onSubmit,
}: UseFormHookParameters): UseFormHook {
  const [isValid, setIsValid] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const valueMap = Object.entries(inputs).reduce(
    (acc, [key, value]) => Object.assign(acc, { [key]: value.value }),
    {}
  );
  const formInputs = Object.values(inputs);
  const values = formInputs.map(({ value }) => value);
  const touched = formInputs.map(({ touched }) => touched);

  useEffect(() => {
    const allValid = formInputs.every(({ hasError }) => !hasError);
    const allTouched = formInputs.every(({ touched }) => touched);

    setIsValid(allValid && allTouched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...values, ...touched]);

  const handleSubmit = useCallback(
    (evt: FormEvent) => {
      evt.preventDefault();

      setHasSubmitted(true);

      for (const formInput of formInputs) {
        formInput.triggerValidation();
      }

      const allValid = formInputs.every(({ hasError }) => !hasError);
      const allTouched = formInputs.every(({ touched }) => touched);

      if (allTouched && allValid) {
        onSubmit(valueMap);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSubmit, ...values, ...touched]
  );

  return {
    handleSubmit,
    inputs,
    isValid,
    canSubmit: !hasSubmitted || isValid,
  };
}
