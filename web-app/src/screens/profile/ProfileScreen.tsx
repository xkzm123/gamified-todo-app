import { useGameStore } from '../../store/useGameStore';
import { xpToNextLevel } from '../../utils/gamification';
import { formatTimestamp } from '../../utils/date';
import StatusBar from '../../components/common/StatusBar';

export default function ProfileScreen() {
  const user = useGameStore((s) => s.user);
  const activityLog = useGameStore((s) => s.activityLog);
  const hpPct = Math.max(0, (user.hp / user.maxHp) * 100);

  return (
    <div className="screen">
      <StatusBar />

      <div className="scroll-content">
        <div className="hero-card">
          <div className="hero-avatar">⚔️</div>
          <div className="hero-level">等级 {user.level}</div>
          <div className="hero-xp">{user.xp} / {xpToNextLevel(user.level)} XP</div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-text">❤️ {user.hp}/{user.maxHp}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${hpPct}%`, backgroundColor: '#e74c3c' }} />
              </div>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-text">🪙 {user.gold}</span>
              <span className="hero-stat-sub">金币</span>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">统计</div>
          <div className="stats-grid">
            <StatBox label="完成任务" value={user.totalTasksCompleted} />
            <StatBox label="习惯点击" value={user.totalHabitClicks} />
            <StatBox label="当前连胜" value={`${user.currentStreak}天`} />
            <StatBox label="最长连胜" value={`${user.longestStreak}天`} />
            <StatBox label="死亡次数" value={user.deathCount} />
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
