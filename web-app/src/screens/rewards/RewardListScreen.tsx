import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import { RewardType } from '../../types';
import RewardCard from '../../components/rewards/RewardCard';
import StatusBar from '../../components/common/StatusBar';
import FAB from '../../components/common/FAB';
import EmptyState from '../../components/common/EmptyState';
import Toast from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

export default function RewardListScreen() {
  const navigate = useNavigate();
  const rewards = useGameStore((s) => s.rewards);
  const gold = useGameStore((s) => s.user.gold);
  const redeemReward = useGameStore((s) => s.redeemReward);
  const deleteReward = useGameStore((s) => s.deleteReward);
  const { toast, showToast } = useToast();

  const potion = rewards.find((r) => r.type === RewardType.HealthPotion);
  const customRewards = rewards.filter((r) => r.type === RewardType.Custom);

  const handleRedeem = (rewardId: string, title: string) => {
    const success = redeemReward(rewardId);
    if (success) {
      showToast(`兑换了 "${title}"！`);
    } else {
      showToast('金币不足！');
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`确定要删除"${title}"吗？`)) {
      deleteReward(id);
    }
  };

  return (
    <div className="screen">
      <StatusBar />

      <div className="list-container">
        {potion && (
          <div className="potion-section">
            <RewardCard
              reward={potion}
              canAfford={gold >= potion.goldCost}
              onRedeem={() => handleRedeem(potion.id, potion.title)}
            />
          </div>
        )}

        {customRewards.length === 0 ? (
          <EmptyState icon="🎁" message="还没有自定义奖励\n创建奖励来激励自己吧！" />
        ) : (
          customRewards.map((item) => (
            <RewardCard
              key={item.id}
              reward={item}
              canAfford={gold >= item.goldCost}
              onRedeem={() => handleRedeem(item.id, item.title)}
              onEdit={() => navigate(`/rewards/edit/${item.id}`)}
              onDelete={() => handleDelete(item.id, item.title)}
            />
          ))
        )}
        <div className="bottom-spacer" />
      </div>

      <FAB onClick={() => navigate('/rewards/add')} />
      <Toast toast={toast} />
    </div>
  );
}
