import type { Reward } from '../../types';
import { RewardType } from '../../types';
import { IconCoin, IconTrash } from '../common/Icons';

interface Props {
  reward: Reward;
  canAfford: boolean;
  onRedeem: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BUILT_IN_TYPES = [RewardType.HealthPotion, RewardType.XpBoost, RewardType.StreakFreeze];

const CARD_TYPE_CLASS: Record<string, string> = {
  [RewardType.HealthPotion]: 'card-potion',
  [RewardType.XpBoost]: 'card-boost',
  [RewardType.StreakFreeze]: 'card-freeze',
};

export default function RewardCard({ reward, canAfford, onRedeem, onEdit, onDelete }: Props) {
  const isBuiltIn = BUILT_IN_TYPES.includes(reward.type);
  const cardClass = CARD_TYPE_CLASS[reward.type] || '';

  return (
    <div className={`card ${cardClass}`}>
      <div className="card-content" onClick={onEdit}>
        <div className="card-header-row">
          <span className="card-title">{reward.title}</span>
          <span className="cost-text"><IconCoin size={14} /> {reward.goldCost}</span>
        </div>
        {reward.description && <div className="card-desc">{reward.description}</div>}
      </div>

      <div className="reward-actions">
        <button
          className={`redeem-btn ${!canAfford ? 'redeem-disabled' : ''}`}
          onClick={onRedeem}
          disabled={!canAfford}
        >
          {isBuiltIn ? '使用' : '兑换'}
        </button>
        {onDelete && !isBuiltIn && (
          <button className="del-btn" onClick={onDelete}><IconTrash size={16} /></button>
        )}
      </div>
    </div>
  );
}
