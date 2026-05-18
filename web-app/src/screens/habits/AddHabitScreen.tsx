import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/useGameStore';
import HabitForm from '../../components/habits/HabitForm';

export default function AddHabitScreen() {
  const navigate = useNavigate();
  const addHabit = useGameStore((s) => s.addHabit);

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <span className="header-title">新建习惯</span>
        <div className="header-spacer" />
      </div>
      <HabitForm
        onSave={(data) => {
          addHabit(data);
          navigate(-1);
        }}
      />
    </div>
  );
}
