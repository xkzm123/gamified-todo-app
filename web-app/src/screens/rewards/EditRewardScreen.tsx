import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import RewardForm from '../../components/rewards/RewardForm';

export default function EditRewardScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const rewards = useGameStore((s) => s.rewards);
  const updateReward = useGameStore((s) => s.updateReward);

  const reward = rewards.find((r) => r.id === id);

  if (!reward) {
    navigate('/rewards', { replace: true });
    return null;
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <span className="header-title">编辑奖励</span>
        <div className="header-spacer" />
      </div>
      <RewardForm
        initialTitle={reward.title}
        initialDescription={reward.description || ''}
        initialGoldCost={reward.goldCost}
        onSave={(data) => {
          updateReward(id!, data);
          navigate(-1);
        }}
      />
    </div>
  );
}
