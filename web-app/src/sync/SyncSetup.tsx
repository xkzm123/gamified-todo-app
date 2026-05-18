import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { generateSyncKey, initSync, onRemoteUpdate, schedulePush, closeSync, isSyncActive } from './gunSync';

export default function SyncSetup() {
  const syncKey = useGameStore((s) => s.syncKey);
  const setSyncKey = useGameStore((s) => s.setSyncKey);
  const setFromRemote = useGameStore((s) => s.setFromRemote);

  const [inputKey, setInputKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'synced' | 'error'>('idle');
  const [showInput, setShowInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!syncKey || initialized.current) return;
    initialized.current = true;

    setStatus('connecting');

    initSync(syncKey).then(() => {
      setStatus('synced');

      onRemoteUpdate((remoteState) => {
        const localState = useGameStore.getState();

        // Compare data ignoring lastModified to avoid echo loops
        const { lastModified: _r, ...remoteData } = remoteState;
        const { lastModified: _l, ...localData } = localState;
        if (JSON.stringify(remoteData) === JSON.stringify(localData)) return;

        const remoteTime = remoteState.lastModified || '';
        const localTime = localState.lastModified || '';
        if (remoteTime > localTime) {
          setFromRemote(remoteState);
        }
      });

      // Push current local state on connect
      schedulePush(useGameStore.getState());
    }).catch(() => {
      setStatus('error');
    });

    return () => {
      closeSync();
      initialized.current = false;
    };
  }, [syncKey]);

  // Subscribe to local changes and push to Gun
  useEffect(() => {
    if (!isSyncActive()) return;

    const unsub = useGameStore.subscribe((state, prevState) => {
      // Don't push if only lastModified changed (remote update)
      const { lastModified: _a, ...curr } = state;
      const { lastModified: _b, ...prev } = prevState;
      if (JSON.stringify(curr) === JSON.stringify(prev)) return;
      schedulePush(state);
    });

    return unsub;
  }, [syncKey]);

  const handleGenerate = () => {
    const key = generateSyncKey();
    setSyncKey(key);
    setShowInput(false);
  };

  const handleConnect = () => {
    const trimmed = inputKey.trim().toUpperCase();
    if (trimmed.length < 10) return;
    setSyncKey(trimmed);
    setShowInput(false);
  };

  const handleDisconnect = () => {
    closeSync();
    setSyncKey(null);
    setStatus('idle');
    initialized.current = false;
  };

  const handleCopy = () => {
    if (syncKey) {
      navigator.clipboard.writeText(syncKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!syncKey) {
    return (
      <div className="sync-section">
        <div className="section-title">云端同步</div>

        {!showInput ? (
          <div className="sync-setup">
            <p className="sync-desc">
              在两台设备间自动同步数据，无需服务器或账号
            </p>
            <div className="sync-actions">
              <button className="sync-btn sync-btn-primary" onClick={handleGenerate}>
                创建同步密钥
              </button>
              <button className="sync-btn sync-btn-secondary" onClick={() => setShowInput(true)}>
                输入已有密钥
              </button>
            </div>
          </div>
        ) : (
          <div className="sync-setup">
            <p className="sync-desc">
              在另一台设备复制同步密钥后，粘贴到下方
            </p>
            <input
              className="sync-input"
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value.toUpperCase())}
              placeholder="XXXX-XXXX-XXXX"
              maxLength={14}
              autoFocus
            />
            <div className="sync-actions">
              <button className="sync-btn sync-btn-primary" onClick={handleConnect}>
                连接
              </button>
              <button className="sync-btn sync-btn-secondary" onClick={() => setShowInput(false)}>
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="sync-section">
      <div className="section-title">云端同步</div>
      <div className="sync-connected">
        <div className="sync-status-row">
          <span className={`sync-status-dot sync-status-${status}`} />
          <span className="sync-status-text">
            {status === 'connecting' ? '连接中...' : status === 'synced' ? '已同步' : status === 'error' ? '连接失败' : ''}
          </span>
        </div>
        <div className="sync-key-display">
          <span className="sync-key-label">同步密钥</span>
          <span className="sync-key-value">{syncKey}</span>
        </div>
        <div className="sync-actions">
          <button className="sync-btn sync-btn-secondary" onClick={handleCopy}>
            {copied ? '已复制' : '复制密钥'}
          </button>
          <button className="sync-btn sync-btn-danger" onClick={handleDisconnect}>
            断开同步
          </button>
        </div>
      </div>
    </div>
  );
}
