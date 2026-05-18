import type { AppState } from '../types';

let gun: any = null;
let syncNode: any = null;
let isLocalUpdate = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastPushedData: string | null = null;

export function generateSyncKey(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const parts: string[] = [];
  for (let i = 0; i < 3; i++) {
    let part = '';
    for (let j = 0; j < 4; j++) {
      part += chars[Math.floor(Math.random() * chars.length)];
    }
    parts.push(part);
  }
  return parts.join('-');
}

export async function initSync(key: string): Promise<void> {
  closeSync();

  const Gun = (await import('gun')).default;

  gun = Gun({
    peers: ['https://gun-manhattan.herokuapp.com/gun'],
    localStorage: false,
  });

  syncNode = gun.get(`gamified-todo-app/${key}`);
  lastPushedData = null;
}

export function pushState(state: AppState): void {
  if (!syncNode) return;

  const stateWithTime = { ...state, lastModified: new Date().toISOString() };
  const dataStr = JSON.stringify(stateWithTime);

  // Don't push the same data twice (prevents echo loops)
  if (dataStr === lastPushedData) return;
  lastPushedData = dataStr;

  isLocalUpdate = true;
  syncNode.put({
    s: dataStr,
  });
  setTimeout(() => {
    isLocalUpdate = false;
  }, 100);
}

export function schedulePush(state: AppState): void {
  if (!syncNode) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    pushState(state);
  }, 3000);
}

export function onRemoteUpdate(callback: (state: AppState) => void): () => void {
  if (!syncNode) return () => {};

  syncNode.on((nodeData: any) => {
    if (isLocalUpdate) return;
    if (!nodeData || !nodeData.s) return;
    try {
      const remoteState = JSON.parse(nodeData.s) as AppState;
      callback(remoteState);
    } catch {
      // ignore parse errors from corrupted data
    }
  });

  return () => {
    if (syncNode) syncNode.off();
  };
}

export function closeSync(): void {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  lastPushedData = null;
  if (syncNode) {
    syncNode.off();
    syncNode = null;
  }
  gun = null;
}

export function isSyncActive(): boolean {
  return syncNode !== null;
}
