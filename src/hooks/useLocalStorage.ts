import { useEffect, useState } from "react";

// Seperti useState, tapi nilainya otomatis disimpan di localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error("Gagal menyimpan ke localStorage (kemungkinan penuh).");
    }
  }, [key, value]);

  return [value, setValue] as const;
}