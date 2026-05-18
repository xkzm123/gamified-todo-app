import type { Reward } from '../../types';
import { RewardType } from '../../types';

interface Props {
  reward: Reward;
  canAfford: boolean;
  onRedeem: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function RewardCard({ reward, canAfford, onRedeem, onEdit, onDelete }: Props) {
  const isPotion = reward.type === RewardType.HealthPotion;

  return (
    <div className={`card ${isPotion ? 'card-potion' : ''}`}>
      <div className="card-content" onClick={onEdit}>
        <div className="card-header-row">
          <span className="card-title">{reward.title}</span>
          <span className="cost-text">🪙 {reward.goldCost}</span>
        </div>
        {reward.description && <div className="card-desc">{reward.description}</div>}
      </div>

      <div className="reward-actions">
        <button
          className={`redeem-btn ${!canAfford ? 'redeem-disabled' : ''}`}
          onClick={onRedeem}
          disabled={!canAfford}
        >
          {isPotion ? '使用' : '兑换'}
        </button>
        {onDelete && !isPotion && (
          <button className="del-btn" onClick={onDelete}>🗑</button>
        )}
      </div>
    </div>
  );
}
