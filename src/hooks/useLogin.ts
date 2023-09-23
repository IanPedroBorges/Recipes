import { useState } from 'react';

export function useLogin(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return {
    value,
    handleChange,
  };
}
