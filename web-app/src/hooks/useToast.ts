import { useState, useCallback, useRef } from 'react';

export interface ToastData {
  message: string;
  visible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastData>({ message: '', visible: false });
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const showToast = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, visible: true });
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 1500);
  }, []);

  const hideToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast((t) => ({ ...t, visible: false }));
  }, []);

  return { toast, showToast, hideToast };
}
