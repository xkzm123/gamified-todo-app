import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import RewardForm from '../../components/rewards/RewardForm';

export default function AddRewardScreen() {
  const navigate = useNavigate();
  const addReward = useGameStore((s) => s.addReward);

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <span className="header-title">新建奖励</span>
        <div className="header-spacer" />
      </div>
      <RewardForm
        onSave={(data) => {
          addReward(data);
          navigate(-1);
        }}
      />
    </div>
  );
}
