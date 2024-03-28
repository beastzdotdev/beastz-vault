import { useCallback, useEffect, useState } from 'react';

const DEBOUNCE_TIME = 500; // ms

interface DebounceValue<T> {
  stringValue: string | null;
  addition?: T | null;
}

interface DebounceItemParams<T extends object> {
  value: DebounceValue<T>;
  debounceTime?: number;
  onClear?: () => void;
  onDebounceSetValue?: (value: string) => void;
}

export const useDebounceHookItem = <T extends object>(params: DebounceItemParams<T>) => {
  const [item, setItem] = useState<DebounceValue<T> | null>(params?.value ?? null);

  const setValueDebounced = useCallback(() => {
    const value = item?.stringValue?.trim();

    if (value) {
      params?.onDebounceSetValue?.(value);
      setItem(item);
    }

    // important to check only on empty string (null check will cause extra api call)
    if (value === '') {
      params?.onClear?.();
    }
  }, [params, item]);

  useEffect(() => {
    const debounceSearch = setTimeout(
      () => setValueDebounced(),
      params?.debounceTime ?? DEBOUNCE_TIME
    );
    return () => clearTimeout(debounceSearch);
  }, [params?.debounceTime, setValueDebounced, item]); // Only re-run the effect if searchTerm changes

  return {
    item,
    setItem,
  };
};
