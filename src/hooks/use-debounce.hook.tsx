import { useCallback, useEffect, useState } from 'react';

const DEBOUNCE_TIME = 500; // ms

interface DebounceValueParams {
  debounceTime?: number;
  onClear?: () => void;
  onDebounceSetValue?: (value: string) => void;
  value?: string | null;
}

export const useDebounceHook = (params?: DebounceValueParams) => {
  const [value, setValue] = useState<string | null>(params?.value ?? null);

  const setValueDebounced = useCallback(() => {
    if (value?.trim()) {
      params?.onDebounceSetValue?.(value?.trim());
      setValue(value?.trim());
    }

    // important to check only on empty string (null check will cause extra api call)
    if (value === '') {
      params?.onClear?.();
    }
  }, [params, value]);

  useEffect(() => {
    const debounceSearch = setTimeout(
      () => setValueDebounced(),
      params?.debounceTime ?? DEBOUNCE_TIME
    );
    return () => clearTimeout(debounceSearch);
  }, [params?.debounceTime, setValueDebounced, value]); // Only re-run the effect if searchTerm changes

  return [value, setValue] as const;
};
