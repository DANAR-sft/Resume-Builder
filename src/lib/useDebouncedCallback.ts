import { useRef, useEffect, useCallback } from "react";

/**
 * Hook untuk menunda pemanggilan callback.
 * Berguna agar setState tidak terlalu sering dipanggil saat user mengetik.
 *
 * Mengembalikan [debouncedFn, flushFn]:
 * - debouncedFn  : versi callback yang ditunda (delay ms)
 * - flushFn      : langsung jalankan callback terakhir tanpa menunggu delay
 */
export function useDebouncedCallback(
  callback: (...args: any[]) => void,
  delay = 300,
): [(...args: any[]) => void, () => void] {
  // Simpan timer ID supaya bisa di-cancel
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Simpan argumen terakhir supaya bisa di-flush
  const lastArgsRef = useRef<any[] | null>(null);
  // Simpan callback terbaru supaya tidak perlu recreate debounced function
  const callbackRef = useRef(callback);

  // Update callback ref setiap kali callback berubah
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Bersihkan timer saat component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Fungsi debounced — panggil callback setelah delay
  const debounced = useCallback(
    (...args: any[]) => {
      lastArgsRef.current = args;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (lastArgsRef.current) callbackRef.current(...lastArgsRef.current);
        lastArgsRef.current = null;
        timeoutRef.current = null;
      }, delay);
    },
    [delay],
  );

  // Flush — langsung jalankan callback tanpa tunggu delay
  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (lastArgsRef.current) {
      callbackRef.current(...lastArgsRef.current);
      lastArgsRef.current = null;
    }
  }, []);

  return [debounced, flush];
}
