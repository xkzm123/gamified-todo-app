import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export function useMidnightReset() {
  const checkAndResetDailies = useGameStore((s) => s.checkAndResetDailies);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    checkAndResetDailies();

    const scheduleMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = midnight.getTime() - now.getTime();
      timerRef.current = setTimeout(() => {
        checkAndResetDailies();
        scheduleMidnight();
      }, msUntilMidnight);
    };
    scheduleMidnight();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAndResetDailies();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [checkAndResetDailies]);
}
