import { useGameStore } from '../../store/useGameStore';
import { xpToNextLevel } from '../../utils/gamification';
import { formatTimestamp } from '../../utils/date';
import StatusBar from '../../components/common/StatusBar';
import { IconHeart, IconCoin, IconSword, IconBoss } from '../../components/common/Icons';

export default function ProfileScreen() {
  const user = useGameStore((s) => s.user);
  const activityLog = useGameStore((s) => s.activityLog);
  const boss = useGameStore((s) => s.boss);
  const totalBossesDefeated = useGameStore((s) => s.totalBossesDefeated);
  const hpPct = Math.max(0, (user.hp / user.maxHp) * 100);
  const bossHpPct = boss ? Math.max(0, (boss.hp / boss.maxHp) * 100) : 0;

  return (
    <div className="screen">
      <StatusBar />

      <div className="scroll-content">
        <div className="hero-card">
          <div className="hero-avatar" style={{ color: '#f59e0b' }}><IconSword size={48} /></div>
          <div className="hero-level">等级 {user.level}</div>
          <div className="hero-xp">{user.xp} / {xpToNextLevel(user.level)} XP</div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-text">
                <span className="status-icon"><IconHeart size={12} /></span> {user.hp}/{user.maxHp}
              </span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${hpPct}%`, backgroundColor: '#e74c3c' }} />
              </div>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-text"><IconCoin size={14} /> {user.gold}</span>
              <span className="hero-stat-sub">金币</span>
            </div>
          </div>
        </div>

        {boss && !boss.defeated && (
          <div className="boss-card">
            <div className="boss-header">
              <div className={`boss-icon boss-icon-${boss.imageType}`}>
                <IconBoss imageType={boss.imageType} size={32} />
              </div>
              <div>
                <div className="boss-name">{boss.name}</div>
                <div className="boss-sub">Lv.{boss.level} 首领战</div>
              </div>
            </div>
            <div className="boss-hp-bar">
              <div className="boss-hp-fill" style={{ width: `${bossHpPct}%` }} />
            </div>
            <div className="boss-hp-text">{boss.hp}/{boss.maxHp}</div>
            <div className="boss-reward">击败奖励: +{boss.xpReward} XP +{boss.goldReward} 金币</div>
          </div>
        )}

        <div className="section">
          <div className="section-title">统计</div>
          <div className="stats-grid">
            <StatBox label="完成任务" value={user.totalTasksCompleted} />
            <StatBox label="习惯点击" value={user.totalHabitClicks} />
            <StatBox label="当前连胜" value={`${user.currentStreak}天`} />
            <StatBox label="最长连胜" value={`${user.longestStreak}天`} />
            <StatBox label="死亡次数" value={user.deathCount} />
            <StatBox label="击败Boss" value={totalBossesDefeated} />
          </div>
        </div>

        <div className="section">
          <div className="section-title">最近动态</div>
          {activityLog.length === 0 ? (
            <div className="empty-log">还没有活动记录</div>
          ) : (
            activityLog.slice(0, 20).map((entry) => (
              <div key={entry.id} className="log-item">
                <span className="log-msg">{entry.message}</span>
                <span className="log-time">{formatTimestamp(entry.timestamp)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat-box">
      <div className="stat-box-val">{value}</div>
      <div className="stat-box-lbl">{label}</div>
    </div>
  );
}
