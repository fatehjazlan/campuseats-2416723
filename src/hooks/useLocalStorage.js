import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return {
        key,
        value: saved !== null ? JSON.parse(saved) : initialValue,
      };
    } catch {
      return { key, value: initialValue };
    }
  });

  // Read again when the key changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);

      setStored({
        key,
        value: saved !== null ? JSON.parse(saved) : initialValue,
      });
    } catch {
      setStored({ key, value: initialValue });
    }
  }, [key]);

  const value =
    stored.key === key
      ? stored.value
      : (() => {
          try {
            const saved = localStorage.getItem(key);
            return saved !== null ? JSON.parse(saved) : initialValue;
          } catch {
            return initialValue;
          }
        })();

  useEffect(() => {
    if (stored.key !== key) return;

    try {
      localStorage.setItem(key, JSON.stringify(stored.value));
    } catch (error) {
      console.error("Could not save to localStorage:", error);
    }
  }, [key, stored]);

  function setValue(newValue) {
    setStored((prev) => {
      const current = prev.key === key ? prev.value : value;

      return {
        key,
        value: typeof newValue === "function" ? newValue(current) : newValue,
      };
    });
  }

  return [value, setValue];
}
