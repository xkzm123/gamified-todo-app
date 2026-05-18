import { useGameStore } from '../../store/useGameStore';
import { xpToNextLevel } from '../../utils/gamification';
import { IconHeart, IconStar, IconCoin } from './Icons';

export default function StatusBar() {
  const hp = useGameStore((s) => s.user.hp);
  const maxHp = useGameStore((s) => s.user.maxHp);
  const xp = useGameStore((s) => s.user.xp);
  const level = useGameStore((s) => s.user.level);
  const gold = useGameStore((s) => s.user.gold);

  const hpPct = Math.max(0, (hp / maxHp) * 100);
  const xpPct = Math.min(100, (xp / xpToNextLevel(level)) * 100);

  return (
    <div className="status-bar">
      <div className="status-item">
        <span className="status-label">
          <span className="status-icon"><IconHeart size={12} /></span> {hp}/{maxHp}
        </span>
        <div className="bar-track hp-track">
          <div className="bar-fill hp-fill" style={{ width: `${hpPct}%` }} />
        </div>
      </div>
      <div className="status-item status-xp">
        <span className="status-label">
          <span className="status-icon"><IconStar size={12} /></span> Lv.{level}
        </span>
        <div className="bar-track xp-track">
          <div className="bar-fill xp-fill" style={{ width: `${xpPct}%` }} />
        </div>
      </div>
      <div className="status-gold"><IconCoin size={14} /> {gold}</div>
    </div>
  );
}
