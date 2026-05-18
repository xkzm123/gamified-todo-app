import { useEffect, useRef, useState } from 'react';
import { ToastData } from '../../hooks/useToast';

interface Props {
  toast: ToastData;
}

export default function Toast({ toast }: Props) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (toast.visible) {
      setShow(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShow(false), 1500);
    }
  }, [toast.visible, toast.message]);

  if (!toast.visible && !show) return null;

  return (
    <div className={`toast ${show ? 'toast-visible' : 'toast-hiding'}`}>
      {toast.message}
    </div>
  );
}
